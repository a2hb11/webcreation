-- Core schema for the studio site.
--
-- Security model (enforced by Postgres, not by the app):
--   * anon / authenticated may only SELECT published rows of public content.
--   * Nobody but the service role may INSERT inquiries (done server-side after
--     validation). Anon has no write privilege anywhere.
--   * "Admin" means: the signed-in user is listed in admin_users AND has passed
--     two-factor authentication (JWT aal = 'aal2'). Only admins may write.
--   * Every admin write is recorded in audit_log by a trigger.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Admin allowlist. Rows are added by the owner via SQL / dashboard only.
create table public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text not null unique,
  created_at timestamptz not null default now()
);

-- True only for an allow-listed user whose session passed MFA.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    coalesce((select auth.jwt() ->> 'aal') = 'aal2', false)
    and exists (
      select 1 from public.admin_users au where au.user_id = (select auth.uid())
    );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Audit log
-- ---------------------------------------------------------------------------

create table public.audit_log (
  id         bigint generated always as identity primary key,
  actor      uuid,
  action     text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  table_name text not null,
  row_id     text,
  old_row    jsonb,
  new_row    jsonb,
  created_at timestamptz not null default now()
);

create index audit_log_table_created_idx on public.audit_log (table_name, created_at desc);

create or replace function public.write_audit_log()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_row_id text;
begin
  if tg_op = 'DELETE' then
    v_row_id := (to_jsonb(old) ->> 'id');
    insert into public.audit_log (actor, action, table_name, row_id, old_row)
    values ((select auth.uid()), tg_op, tg_table_name, v_row_id, to_jsonb(old));
    return old;
  elsif tg_op = 'UPDATE' then
    v_row_id := (to_jsonb(new) ->> 'id');
    insert into public.audit_log (actor, action, table_name, row_id, old_row, new_row)
    values ((select auth.uid()), tg_op, tg_table_name, v_row_id, to_jsonb(old), to_jsonb(new));
    return new;
  else
    v_row_id := (to_jsonb(new) ->> 'id');
    insert into public.audit_log (actor, action, table_name, row_id, new_row)
    values ((select auth.uid()), tg_op, tg_table_name, v_row_id, to_jsonb(new));
    return new;
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- Content tables (all bilingual: *_en / *_ar)
-- ---------------------------------------------------------------------------

create domain public.slug_text as text
  check (value ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and length(value) between 2 and 80);

create type public.tier as enum ('starter', 'professional', 'elite');

create table public.categories (
  id             uuid primary key default gen_random_uuid(),
  slug           public.slug_text not null unique,
  name_en        text not null,
  name_ar        text not null,
  description_en text not null default '',
  description_ar text not null default '',
  icon           text not null default 'layout',
  sort_order     integer not null default 0,
  published      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.projects (
  id             uuid primary key default gen_random_uuid(),
  slug           public.slug_text not null unique,
  category_id    uuid not null references public.categories (id) on delete restrict,
  tier           public.tier not null,
  title_en       text not null,
  title_ar       text not null,
  summary_en     text not null default '',
  summary_ar     text not null default '',
  body_en        text not null default '',
  body_ar        text not null default '',
  client_name    text,
  is_concept     boolean not null default true,
  cover_path     text,
  accent_color   text check (accent_color is null or accent_color ~ '^#[0-9a-fA-F]{6}$'),
  live_url       text check (live_url is null or live_url ~ '^https://'),
  demo_route     text check (demo_route is null or demo_route ~ '^/demo/[a-z0-9-]+$'),
  price_from_kwd numeric(10, 3) not null check (price_from_kwd >= 0),
  price_to_kwd   numeric(10, 3) not null check (price_to_kwd >= price_from_kwd),
  duration_days  integer check (duration_days is null or duration_days > 0),
  features       jsonb not null default '[]'::jsonb,
  tech_stack     text[] not null default '{}',
  featured       boolean not null default false,
  published      boolean not null default false,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint projects_features_is_array check (jsonb_typeof(features) = 'array')
);

create index projects_category_published_idx on public.projects (category_id, published, sort_order);
create index projects_featured_idx on public.projects (featured) where published;

create table public.project_images (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  path       text not null,
  alt_en     text not null default '',
  alt_ar     text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index project_images_project_idx on public.project_images (project_id, sort_order);

-- Packages = the Starter / Professional / Elite offers. category_id null means
-- the generic offer shown on the pricing page; per-category rows override it.
create table public.packages (
  id                uuid primary key default gen_random_uuid(),
  category_id       uuid references public.categories (id) on delete cascade,
  tier              public.tier not null,
  name_en           text not null,
  name_ar           text not null,
  tagline_en        text not null default '',
  tagline_ar        text not null default '',
  price_from_kwd    numeric(10, 3) not null check (price_from_kwd >= 0),
  price_to_kwd      numeric(10, 3) not null check (price_to_kwd >= price_from_kwd),
  delivery_days_min integer not null check (delivery_days_min > 0),
  delivery_days_max integer not null check (delivery_days_max >= delivery_days_min),
  includes          jsonb not null default '[]'::jsonb,
  highlighted       boolean not null default false,
  published         boolean not null default true,
  sort_order        integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint packages_includes_is_array check (jsonb_typeof(includes) = 'array'),
  constraint packages_unique_per_scope unique nulls not distinct (category_id, tier)
);

-- Things that push the price up, each with an example and a KWD delta range.
create table public.price_factors (
  id             uuid primary key default gen_random_uuid(),
  slug           public.slug_text not null unique,
  name_en        text not null,
  name_ar        text not null,
  description_en text not null default '',
  description_ar text not null default '',
  example_en     text not null default '',
  example_ar     text not null default '',
  delta_from_kwd numeric(10, 3) not null default 0 check (delta_from_kwd >= 0),
  delta_to_kwd   numeric(10, 3) not null default 0 check (delta_to_kwd >= delta_from_kwd),
  -- 'flat' adds delta once; 'per_unit' multiplies by a quantity (e.g. pages).
  pricing_mode   text not null default 'flat' check (pricing_mode in ('flat', 'per_unit')),
  unit_label_en  text,
  unit_label_ar  text,
  max_units      integer check (max_units is null or max_units > 0),
  in_calculator  boolean not null default true,
  published      boolean not null default true,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.maintenance_plans (
  id              uuid primary key default gen_random_uuid(),
  slug            public.slug_text not null unique,
  name_en         text not null,
  name_ar         text not null,
  price_kwd_month numeric(10, 3) not null check (price_kwd_month >= 0),
  includes        jsonb not null default '[]'::jsonb,
  highlighted     boolean not null default false,
  published       boolean not null default true,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint maintenance_includes_is_array check (jsonb_typeof(includes) = 'array')
);

-- Fixed exchange rates, edited by the owner. Prices are stored in KWD and
-- converted on display: display = round_to(kwd * rate_per_kwd, rounding).
create table public.currencies (
  code         text primary key check (code ~ '^[A-Z]{3}$'),
  name_en      text not null,
  name_ar      text not null,
  symbol       text not null,
  rate_per_kwd numeric(14, 6) not null check (rate_per_kwd > 0),
  rounding     numeric(10, 3) not null default 1 check (rounding > 0),
  decimals     smallint not null default 0 check (decimals between 0 and 3),
  is_default   boolean not null default false,
  enabled      boolean not null default true,
  sort_order   integer not null default 0,
  updated_at   timestamptz not null default now()
);

create unique index currencies_single_default_idx on public.currencies (is_default) where is_default;

create table public.faqs (
  id          uuid primary key default gen_random_uuid(),
  question_en text not null,
  question_ar text not null,
  answer_en   text not null,
  answer_ar   text not null,
  published   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role_en text not null default '',
  author_role_ar text not null default '',
  quote_en    text not null,
  quote_ar    text not null,
  project_id  uuid references public.projects (id) on delete set null,
  published   boolean not null default false,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Key/value settings. Only rows flagged is_public are readable by visitors
-- (e.g. WhatsApp number, hours); the rest are admin-only.
create table public.site_settings (
  key        text primary key check (key ~ '^[a-z0-9_.]{2,64}$'),
  value      jsonb not null,
  is_public  boolean not null default false,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Inquiries (contact / quote / calculator submissions)
-- ---------------------------------------------------------------------------

create type public.inquiry_status as enum ('new', 'contacted', 'won', 'lost', 'spam');

create table public.inquiries (
  id                  uuid primary key default gen_random_uuid(),
  source              text not null check (source in ('contact', 'quote', 'calculator')),
  locale              text not null check (locale in ('en', 'ar')),
  name                text not null check (length(name) between 1 and 120),
  email               text check (email is null or length(email) <= 254),
  phone               text check (phone is null or length(phone) <= 32),
  company             text check (company is null or length(company) <= 120),
  message             text not null check (length(message) <= 4000),
  category_id         uuid references public.categories (id) on delete set null,
  tier                public.tier,
  currency_code       text references public.currencies (code),
  estimate_from_kwd   numeric(10, 3),
  estimate_to_kwd     numeric(10, 3),
  calculator          jsonb,
  status              public.inquiry_status not null default 'new',
  admin_notes         text not null default '',
  ip_hash             text,
  user_agent          text check (user_agent is null or length(user_agent) <= 512),
  notified_email_at   timestamptz,
  notified_whatsapp_at timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index inquiries_status_created_idx on public.inquiries (status, created_at desc);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

do $$
declare
  t text;
begin
  foreach t in array array[
    'categories', 'projects', 'packages', 'price_factors', 'maintenance_plans',
    'currencies', 'faqs', 'testimonials', 'site_settings', 'inquiries'
  ]
  loop
    execute format(
      'create trigger %I_set_updated_at before update on public.%I
         for each row execute function public.set_updated_at()', t, t);
  end loop;

  foreach t in array array[
    'categories', 'projects', 'project_images', 'packages', 'price_factors',
    'maintenance_plans', 'currencies', 'faqs', 'testimonials', 'site_settings',
    'inquiries', 'admin_users'
  ]
  loop
    execute format(
      'create trigger %I_audit after insert or update or delete on public.%I
         for each row execute function public.write_audit_log()', t, t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Privileges: least privilege at the grant level, then RLS on top.
-- ---------------------------------------------------------------------------

revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
alter default privileges in schema public revoke all on tables from anon, authenticated;

-- Public content: read only, for everyone (RLS narrows to published rows).
grant select on
  public.categories, public.projects, public.project_images, public.packages,
  public.price_factors, public.maintenance_plans, public.currencies, public.faqs,
  public.testimonials, public.site_settings
to anon, authenticated;

-- Admin-managed: full DML for signed-in users, gated by RLS (is_admin()).
grant insert, update, delete on
  public.categories, public.projects, public.project_images, public.packages,
  public.price_factors, public.maintenance_plans, public.currencies, public.faqs,
  public.testimonials, public.site_settings
to authenticated;
grant select, update, delete on public.inquiries to authenticated;
grant select on public.admin_users, public.audit_log to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.admin_users       enable row level security;
alter table public.audit_log         enable row level security;
alter table public.categories        enable row level security;
alter table public.projects          enable row level security;
alter table public.project_images    enable row level security;
alter table public.packages          enable row level security;
alter table public.price_factors     enable row level security;
alter table public.maintenance_plans enable row level security;
alter table public.currencies        enable row level security;
alter table public.faqs              enable row level security;
alter table public.testimonials      enable row level security;
alter table public.site_settings     enable row level security;
alter table public.inquiries         enable row level security;

-- Also bind the table owner (belt and braces for direct SQL sessions).
alter table public.admin_users       force row level security;
alter table public.audit_log         force row level security;
alter table public.inquiries         force row level security;

-- admin_users: a user may see only their own row; no client-side writes.
create policy admin_users_self_read on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

-- audit_log: admins read; writes only via the security-definer trigger.
create policy audit_log_admin_read on public.audit_log
  for select to authenticated using ((select public.is_admin()));

-- Published-content pattern.
do $$
declare
  t text;
begin
  foreach t in array array[
    'categories', 'projects', 'packages', 'price_factors',
    'maintenance_plans', 'faqs', 'testimonials'
  ]
  loop
    execute format(
      'create policy %I_public_read on public.%I
         for select to anon, authenticated using (published)', t, t);
    execute format(
      'create policy %I_admin_all on public.%I
         for all to authenticated
         using ((select public.is_admin())) with check ((select public.is_admin()))', t, t);
  end loop;
end $$;

create policy project_images_public_read on public.project_images
  for select to anon, authenticated
  using (exists (select 1 from public.projects p where p.id = project_id and p.published));
create policy project_images_admin_all on public.project_images
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy currencies_public_read on public.currencies
  for select to anon, authenticated using (enabled);
create policy currencies_admin_all on public.currencies
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy site_settings_public_read on public.site_settings
  for select to anon, authenticated using (is_public);
create policy site_settings_admin_all on public.site_settings
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- inquiries: no anon access at all; inserted by the server (service role).
create policy inquiries_admin_read on public.inquiries
  for select to authenticated using ((select public.is_admin()));
create policy inquiries_admin_update on public.inquiries
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy inquiries_admin_delete on public.inquiries
  for delete to authenticated using ((select public.is_admin()));
