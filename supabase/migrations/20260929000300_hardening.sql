-- Hardening after the first Supabase advisor run.
--
--  * every function pins search_path
--  * is_admin() runs as the caller (admin_users is self-readable under RLS),
--    so it is no longer a SECURITY DEFINER surface, and anon cannot call it
--  * the audit trigger function is not callable through the REST API
--  * one permissive policy per role/action (SELECT no longer evaluates two)
--  * covering indexes for the remaining foreign keys

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select
    coalesce((select auth.jwt() ->> 'aal') = 'aal2', false)
    and exists (
      select 1 from public.admin_users au where au.user_id = (select auth.uid())
    );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated, service_role;

-- Trigger functions do not need EXECUTE for the role that fires the trigger.
revoke all on function public.write_audit_log() from public, anon, authenticated;
revoke all on function public.set_updated_at() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Policies: split "admin_all" into per-action policies and fold the admin
-- case into a single authenticated SELECT policy.
-- ---------------------------------------------------------------------------

do $$
declare
  t text;
begin
  foreach t in array array[
    'categories', 'projects', 'packages', 'price_factors',
    'maintenance_plans', 'faqs', 'testimonials'
  ]
  loop
    execute format('drop policy %I_public_read on public.%I', t, t);
    execute format('drop policy %I_admin_all on public.%I', t, t);
    execute format(
      'create policy %I_anon_read on public.%I
         for select to anon using (published)', t, t);
    execute format(
      'create policy %I_auth_read on public.%I
         for select to authenticated using (published or (select public.is_admin()))', t, t);
    execute format(
      'create policy %I_admin_insert on public.%I
         for insert to authenticated with check ((select public.is_admin()))', t, t);
    execute format(
      'create policy %I_admin_update on public.%I
         for update to authenticated
         using ((select public.is_admin())) with check ((select public.is_admin()))', t, t);
    execute format(
      'create policy %I_admin_delete on public.%I
         for delete to authenticated using ((select public.is_admin()))', t, t);
  end loop;
end $$;

drop policy project_images_public_read on public.project_images;
drop policy project_images_admin_all on public.project_images;
create policy project_images_anon_read on public.project_images
  for select to anon
  using (exists (select 1 from public.projects p where p.id = project_id and p.published));
create policy project_images_auth_read on public.project_images
  for select to authenticated
  using (
    (select public.is_admin())
    or exists (select 1 from public.projects p where p.id = project_id and p.published)
  );
create policy project_images_admin_insert on public.project_images
  for insert to authenticated with check ((select public.is_admin()));
create policy project_images_admin_update on public.project_images
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy project_images_admin_delete on public.project_images
  for delete to authenticated using ((select public.is_admin()));

drop policy currencies_public_read on public.currencies;
drop policy currencies_admin_all on public.currencies;
create policy currencies_anon_read on public.currencies
  for select to anon using (enabled);
create policy currencies_auth_read on public.currencies
  for select to authenticated using (enabled or (select public.is_admin()));
create policy currencies_admin_insert on public.currencies
  for insert to authenticated with check ((select public.is_admin()));
create policy currencies_admin_update on public.currencies
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy currencies_admin_delete on public.currencies
  for delete to authenticated using ((select public.is_admin()));

drop policy site_settings_public_read on public.site_settings;
drop policy site_settings_admin_all on public.site_settings;
create policy site_settings_anon_read on public.site_settings
  for select to anon using (is_public);
create policy site_settings_auth_read on public.site_settings
  for select to authenticated using (is_public or (select public.is_admin()));
create policy site_settings_admin_insert on public.site_settings
  for insert to authenticated with check ((select public.is_admin()));
create policy site_settings_admin_update on public.site_settings
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy site_settings_admin_delete on public.site_settings
  for delete to authenticated using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Indexes for foreign keys used in admin filters/joins
-- ---------------------------------------------------------------------------

create index inquiries_category_idx on public.inquiries (category_id);
create index inquiries_currency_idx on public.inquiries (currency_code);
create index testimonials_project_idx on public.testimonials (project_id);
