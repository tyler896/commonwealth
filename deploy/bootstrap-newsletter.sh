#!/usr/bin/env bash
# On the DigitalOcean host (deploy@24.144.82.195):
#   1) Bake VITE_COMMERCE_PUBLISHABLE_KEY into the storefront image
#   2) Optionally import prior signup emails into Spree newsletter subscribers
#
# Usage:
#   bash deploy/bootstrap-newsletter.sh
#   bash deploy/bootstrap-newsletter.sh /path/to/emails.txt
set -euo pipefail

APP_DIR="${APP_DIR:-/home/deploy/commonwealth}"
cd "$APP_DIR"

if [[ ! -f commerce/.env ]]; then
  echo "missing commerce/.env" >&2
  exit 1
fi

extract_key() {
  local file="$1"
  grep -E '^(VITE_COMMERCE_PUBLISHABLE_KEY|SPREE_STOREFRONT_KEY|PUBLISHABLE_KEY|SPREE_PUBLISHABLE_KEY)=' "$file" 2>/dev/null \
    | head -1 \
    | cut -d= -f2- \
    | tr -d '"' \
    | tr -d "'" \
    || true
}

PK="$(extract_key .env 2>/dev/null || true)"
if [[ -z "${PK}" ]]; then
  PK="$(extract_key commerce/.env)"
fi

if [[ -z "${PK}" || "${PK}" != pk_* ]]; then
  echo "No publishable key (pk_…) found in .env or commerce/.env." >&2
  echo "In Spree admin → Developers / API keys, copy the publishable key, then:" >&2
  echo "  echo 'VITE_COMMERCE_PUBLISHABLE_KEY=pk_…' >> /home/deploy/commonwealth/.env" >&2
  echo "and re-run this script." >&2
  exit 1
fi

umask 077
touch .env
if grep -q '^VITE_COMMERCE_PUBLISHABLE_KEY=' .env 2>/dev/null; then
  grep -v '^VITE_COMMERCE_PUBLISHABLE_KEY=' .env > .env.tmp || true
  mv .env.tmp .env
fi
printf 'VITE_COMMERCE_PUBLISHABLE_KEY=%s\n' "$PK" >> .env
if ! grep -q '^VITE_COMMERCE_API_URL=' .env 2>/dev/null; then
  echo 'VITE_COMMERCE_API_URL=' >> .env
fi

echo "Pulling main…"
git fetch --quiet origin main
git reset --hard origin/main
git clean -fd -e commerce/.env -e 'commerce/.env.*' -e .env -e '.deploy-state'

echo "Rebuilding storefront…"
docker compose -f docker-compose.prod.yml build --no-cache web
docker compose -f docker-compose.prod.yml up -d web

curl -sf "http://127.0.0.1:3023/" >/dev/null
curl -sf "http://127.0.0.1:3024/up" >/dev/null
echo "Storefront rebuilt."

IMPORT_FILE="${1:-}"
if [[ -n "$IMPORT_FILE" ]]; then
  if [[ ! -f "$IMPORT_FILE" ]]; then
    echo "import file not found: $IMPORT_FILE" >&2
    exit 1
  fi
  echo "Importing emails into Spree newsletter subscribers…"
  (
    cd commerce
    docker compose -f docker-compose.prod.yml cp "$IMPORT_FILE" web:/tmp/newsletter_emails.txt
    docker compose -f docker-compose.prod.yml cp ./scripts/seed_newsletter_from_file.rb web:/tmp/seed_newsletter_from_file.rb
    docker compose -f docker-compose.prod.yml exec -T web bin/rails runner /tmp/seed_newsletter_from_file.rb
  )
fi

echo "Done."
