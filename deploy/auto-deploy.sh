#!/usr/bin/env bash
# Pull origin/main and apply storefront + commerce updates on the live host.
# Runs as user `deploy` via systemd timer (deploy/commonwealth-autodeploy.*).
set -euo pipefail

APP_DIR="${APP_DIR:-/home/deploy/commonwealth}"
LOG_TAG="commonwealth-autodeploy"
LOCK_FILE="${XDG_RUNTIME_DIR:-/tmp}/commonwealth-autodeploy.lock"

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  logger -t "$LOG_TAG" "skip: another deploy is running"
  exit 0
fi

cd "$APP_DIR"

if [[ ! -f commerce/.env ]]; then
  logger -t "$LOG_TAG" "error: missing commerce/.env — aborting"
  exit 1
fi

git fetch --quiet origin main
LOCAL="$(git rev-parse HEAD)"
REMOTE="$(git rev-parse origin/main)"

if [[ "$LOCAL" == "$REMOTE" ]]; then
  exit 0
fi

PREVIOUS="$LOCAL"
logger -t "$LOG_TAG" "deploying ${PREVIOUS:0:7} -> ${REMOTE:0:7}"

CHANGED="$(git diff --name-only "$PREVIOUS" "$REMOTE" || true)"

git reset --hard origin/main
git clean -fd -e commerce/.env -e 'commerce/.env.*' -e '.deploy-state'

rebuild_web=0
restart_commerce=0

if echo "$CHANGED" | grep -Eq '^(src/|public/|index\.html|package(-lock)?\.json|vite\.config\.|tsconfig|Dockerfile|docker-compose\.prod\.yml|deploy/nginx-default\.conf|\.dockerignore)'; then
  rebuild_web=1
fi

if echo "$CHANGED" | grep -Eq '^commerce/'; then
  restart_commerce=1
fi

# Safety: unknown/empty file list still refresh storefront
if [[ -z "$CHANGED" ]]; then
  rebuild_web=1
fi

if [[ "$rebuild_web" -eq 1 ]]; then
  logger -t "$LOG_TAG" "rebuilding storefront image"
  docker compose -f docker-compose.prod.yml build web
  docker compose -f docker-compose.prod.yml up -d web
fi

if [[ "$restart_commerce" -eq 1 ]]; then
  logger -t "$LOG_TAG" "updating commerce stack"
  (
    cd commerce
    docker compose -f docker-compose.prod.yml up -d
  )
fi

curl -sf "http://127.0.0.1:3023/" >/dev/null
curl -sf "http://127.0.0.1:3024/up" >/dev/null

logger -t "$LOG_TAG" "ok: now at $(git rev-parse --short HEAD)"
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) $(git rev-parse HEAD)" >>"$APP_DIR/.deploy-state"
