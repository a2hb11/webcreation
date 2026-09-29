#!/usr/bin/env bash
# Applies supabase/seed.sql to the local test database (after reset-local.sh).
set -euo pipefail
: "${PGHOST:=127.0.0.1}" "${PGPORT:=5433}" "${PGUSER:=postgres}" "${DBNAME:=studio_test}"
export PGHOST PGPORT PGUSER
psql -v ON_ERROR_STOP=1 -d "$DBNAME" -qf "$(dirname "$0")/../../supabase/seed.sql"
psql -d "$DBNAME" -Atc "select 'categories', count(*) from public.categories union all select 'packages', count(*) from public.packages union all select 'price_factors', count(*) from public.price_factors union all select 'maintenance_plans', count(*) from public.maintenance_plans union all select 'currencies', count(*) from public.currencies union all select 'site_settings', count(*) from public.site_settings union all select 'faqs', count(*) from public.faqs;"
