#!/usr/bin/env bash
# Starts the production server, fetches every public route in both locales,
# prints status + <h1>, and checks RTL and security headers. Usage:
#   pnpm build && tests/e2e/smoke.sh
set -uo pipefail
PORT="${PORT:-$((3200 + RANDOM % 600))}"
if curl -s -o /dev/null "http://127.0.0.1:$PORT/"; then echo "port $PORT already in use"; exit 1; fi
pnpm start -p "$PORT" > /var/tmp/next-smoke.log 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT
for _ in $(seq 1 40); do curl -s -o /dev/null "http://127.0.0.1:$PORT/en" && break; sleep 1; done
kill -0 $SERVER 2>/dev/null || { echo "server exited early"; cat /var/tmp/next-smoke.log | tail -5; exit 1; }
fail=0
for p in /en/demo/barq-detailing /ar/demo/sahwa-roasters/menu /en/demo/bayt-misk/product/layl /ar/demo/marsa-chalets/book /en /en/work /en/pricing /en/services /en/about /en/contact /en/work/nothing /ar /ar/work /ar/pricing /ar/contact /admin; do
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
