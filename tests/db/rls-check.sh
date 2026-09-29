#!/usr/bin/env bash
# Exercises the RLS model against the local test database:
#   anon           -> reads published rows only, cannot write anything
#   non-admin user -> same as anon
#   admin, no MFA  -> cannot write
#   admin + MFA    -> full access, writes are audited
#   service role   -> may insert inquiries (server-side path)
# Usage: tests/db/reset-local.sh && tests/db/rls-check.sh
set -euo pipefail
: "${PGHOST:=127.0.0.1}" "${PGPORT:=5433}" "${PGUSER:=postgres}" "${DBNAME:=studio_test}"
export PGHOST PGPORT PGUSER PGOPTIONS='-c client_min_messages=warning'
ADMIN=aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa
OTHER=bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb
q() { psql -v ON_ERROR_STOP=1 -qAt -d "$DBNAME" "$@"; }
pass=0; fail=0
ok()   { pass=$((pass+1)); echo "  ok   $1"; }
bad()  { fail=$((fail+1)); echo "  FAIL $1"; }
# claims <role> <sub> <aal>  -> SQL prefix that impersonates a PostgREST request
claims() {
  local role=$1 sub=${2:-} aal=${3:-aal1}
  if [[ -z $sub ]]; then
    echo "set role $role; select set_config('request.jwt.claims','{\"role\":\"$role\"}',true);"
  else
    echo "set role $role; select set_config('request.jwt.claims','{\"role\":\"$role\",\"sub\":\"$sub\",\"aal\":\"$aal\"}',true);"
  fi
}
expect_value() { # name, expected, sql
  local got; got=$(q -c "$3" | tail -n1)
  if [[ "$got" == "$2" ]]; then ok "$1"; else bad "$1 (expected '$2', got '$got')"; fi
}
expect_error() { # name, sql
  if q -c "$2" >/dev/null 2>&1; then bad "$1 (succeeded but should have been denied)"; else ok "$1"; fi
}

echo "seeding fixtures"
q <<SQL
insert into auth.users (id, email) values ('$ADMIN', 'owner@example.com'), ('$OTHER', 'visitor@example.com');
insert into public.admin_users (user_id, email) values ('$ADMIN', 'owner@example.com');
insert into public.categories (slug, name_en, name_ar) values ('shops', 'Online shops', 'متاجر إلكترونية');
insert into public.projects (slug, category_id, tier, title_en, title_ar, price_from_kwd, price_to_kwd, published)
  select 'pub', id, 'starter', 'Published', 'منشور', 100, 200, true from public.categories;
insert into public.projects (slug, category_id, tier, title_en, title_ar, price_from_kwd, price_to_kwd, published)
  select 'draft', id, 'starter', 'Draft', 'مسودة', 100, 200, false from public.categories;
insert into public.currencies (code, name_en, name_ar, symbol, rate_per_kwd, is_default) values ('KWD','Kuwaiti dinar','دينار كويتي','KD',1,true);
insert into public.site_settings (key, value, is_public) values ('whatsapp', '"+96560643311"', true), ('notify_email', '"x@y.z"', false);
SQL

echo "anon"
expect_value "anon sees only published projects" 1 "$(claims anon) select count(*) from public.projects;"
expect_value "anon sees only public settings" 1 "$(claims anon) select count(*) from public.site_settings;"
expect_error "anon cannot insert a project" "$(claims anon) insert into public.projects (slug, category_id, tier, title_en, title_ar, price_from_kwd, price_to_kwd) select 'x', id, 'starter', 'x', 'x', 1, 2 from public.categories;"
expect_error "anon cannot update a project" "$(claims anon) update public.projects set title_en = 'hacked';"
expect_error "anon cannot insert an inquiry" "$(claims anon) insert into public.inquiries (source, locale, name, message) values ('contact','en','a','b');"
expect_error "anon cannot read inquiries" "$(claims anon) select * from public.inquiries;"
expect_error "anon cannot read admin_users" "$(claims anon) select * from public.admin_users;"
expect_error "anon cannot read audit_log" "$(claims anon) select * from public.audit_log;"

echo "signed-in non-admin"
expect_value "non-admin sees only published projects" 1 "$(claims authenticated $OTHER aal2) select count(*) from public.projects;"
expect_error "non-admin cannot insert a project" "$(claims authenticated $OTHER aal2) insert into public.projects (slug, category_id, tier, title_en, title_ar, price_from_kwd, price_to_kwd) select 'x', id, 'starter', 'x', 'x', 1, 2 from public.categories;"
expect_value "non-admin cannot see inquiries" 0 "$(claims authenticated $OTHER aal2) select count(*) from public.inquiries;"
expect_value "non-admin cannot see admin_users rows" 0 "$(claims authenticated $OTHER aal2) select count(*) from public.admin_users;"

echo "admin without MFA (aal1)"
expect_value "admin@aal1 is not admin" f "$(claims authenticated $ADMIN aal1) select public.is_admin();"
expect_value "admin@aal1 sees only published projects" 1 "$(claims authenticated $ADMIN aal1) select count(*) from public.projects;"
expect_error "admin@aal1 cannot insert a project" "$(claims authenticated $ADMIN aal1) insert into public.projects (slug, category_id, tier, title_en, title_ar, price_from_kwd, price_to_kwd) select 'x', id, 'starter', 'x', 'x', 1, 2 from public.categories;"

echo "admin with MFA (aal2)"
expect_value "admin@aal2 is admin" t "$(claims authenticated $ADMIN aal2) select public.is_admin();"
expect_value "admin@aal2 sees all projects" 2 "$(claims authenticated $ADMIN aal2) select count(*) from public.projects;"
expect_value "admin@aal2 can insert a project" 1 "$(claims authenticated $ADMIN aal2) with ins as (insert into public.projects (slug, category_id, tier, title_en, title_ar, price_from_kwd, price_to_kwd) select 'new', id, 'elite', 'New', 'جديد', 500, 900 from public.categories returning 1) select count(*) from ins;"
expect_value "admin write was audited" 1 "$(claims authenticated $ADMIN aal2) select count(*) from public.audit_log where table_name = 'projects' and action = 'INSERT' and actor = '$ADMIN';"
expect_error "admin cannot write audit_log directly" "$(claims authenticated $ADMIN aal2) insert into public.audit_log (action, table_name) values ('INSERT','x');"
expect_error "admin cannot add admins from the client" "$(claims authenticated $ADMIN aal2) insert into public.admin_users (user_id, email) values ('$OTHER','visitor@example.com');"
expect_error "admin cannot insert inquiries from the client" "$(claims authenticated $ADMIN aal2) insert into public.inquiries (source, locale, name, message) values ('contact','en','a','b');"

echo "service role (server-side inquiry path)"
expect_value "service role can insert an inquiry" 1 "$(claims service_role) with ins as (insert into public.inquiries (source, locale, name, message) values ('contact','en','Client','Hello') returning 1) select count(*) from ins;"
expect_value "admin@aal2 can read inquiries" 1 "$(claims authenticated $ADMIN aal2) select count(*) from public.inquiries;"
expect_value "admin@aal2 can update inquiry status" 1 "$(claims authenticated $ADMIN aal2) with u as (update public.inquiries set status = 'contacted' returning 1) select count(*) from u;"

echo "storage"
expect_value "anon can read the public media bucket" 1 "$(claims anon) select count(*) from storage.buckets where id = 'project-media' and public;"
expect_error "anon cannot insert storage objects" "$(claims anon) insert into storage.objects (bucket_id, name) values ('project-media','x.png');"

echo
echo "passed: $pass  failed: $fail"
[[ $fail -eq 0 ]]
