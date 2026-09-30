#!/usr/bin/env bash
# Starts the production server, fetches every public route in both locales,
# prints status + <h1>, and checks RTL and security headers. Usage:
#   pnpm build && tests/e2e/smoke.sh
set -uo pipefail
PORT="${PORT:-3100}"
pnpm start -p "$PORT" > /var/tmp/next-smoke.log 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT
for _ in $(seq 1 40); do curl -s -o /dev/null "http://127.0.0.1:$PORT/en" && break; sleep 1; done
fail=0
for p in /en /en/work /en/pricing /en/services /en/about /en/contact /en/work/nothing /ar /ar/work /ar/pricing /ar/contact /admin; do
  code=$(curl -s -o /var/tmp/page.html -w '%{http_code}' "http://127.0.0.1:$PORT$p")
  h1=$(grep -o '<h1[^>]*>[^<]*' /var/tmp/page.html | head -1 | sed 's/<h1[^>]*>//' | cut -c1-60)
  expected=200; [[ $p == /en/work/nothing ]] && expected=404; [[ $p == /admin ]] && expected=307
  [[ $code == "$expected" ]] || fail=1
  printf "%-20s %s  %s\n" "$p" "$code" "$h1"
done
echo "--- checks ---"
curl -s "http://127.0.0.1:$PORT/ar/pricing" | grep -q 'dir="rtl"' && echo "rtl: ok" || { echo "rtl: MISSING"; fail=1; }
curl -s -D - -o /dev/null "http://127.0.0.1:$PORT/en" | grep -qi "content-security-policy: .*nonce-" && echo "csp nonce: ok" || { echo "csp: MISSING"; fail=1; }
grep -a -i "error" /var/tmp/next-smoke.log | grep -a -v -i "allowlist\|supabase" | head -3
[[ $fail -eq 0 ]] && echo "SMOKE OK" || echo "SMOKE FAILED"
exit $fail
