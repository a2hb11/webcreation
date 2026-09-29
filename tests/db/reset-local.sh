#!/usr/bin/env bash
# Recreate the local test database, apply the Supabase shim, then every
# migration in supabase/migrations in order. Usage: tests/db/reset-local.sh
set -euo pipefail
: "${PGHOST:=127.0.0.1}" "${PGPORT:=5433}" "${PGUSER:=postgres}" "${DBNAME:=studio_test}"
export PGHOST PGPORT PGUSER
psql -v ON_ERROR_STOP=1 -d postgres -qc "drop database if exists ${DBNAME};"
psql -v ON_ERROR_STOP=1 -d postgres -qc "create database ${DBNAME};"
psql -v ON_ERROR_STOP=1 -d "$DBNAME" -qf "$(dirname "$0")/supabase-shim.sql"
shopt -s nullglob
for f in "$(dirname "$0")/../../supabase/migrations/"*.sql; do
  echo "applying $(basename "$f")"
  psql -v ON_ERROR_STOP=1 -d "$DBNAME" -qf "$f"
done
echo "ok: ${DBNAME} ready"
