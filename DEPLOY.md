# Production deploy — agent instructions

Live site: **https://commonwealthseedco.com**

Use this doc when deploying storefront or commerce changes from the `tyler896/commonwealth` repo.

## Access (required once)

| Item | Value |
|------|--------|
| Host | `24.144.82.195` |
| SSH user | `deploy` |
| App directory | `/home/deploy/commonwealth` |
| Domain | `commonwealthseedco.com` (+ `www`) |

```bash
ssh deploy@24.144.82.195
```

**Do not deploy to** `64.23.175.154` — that was the old shared Spree box; Commonwealth was moved off it.

Tyler’s GitHub SSH key (`tyler896`) is already installed on `deploy`. The `deploy` user is in the `docker` group.

If SSH still fails: confirm you’re using the same key as on GitHub, then ask Frederik to check `~deploy/.ssh/authorized_keys`.

## What runs where

Two Docker Compose projects on the same host. Host nginx terminates TLS and routes traffic.

| Piece | Compose project | Bind | Role |
|-------|-----------------|------|------|
| Storefront (Vite → static nginx) | `commonwealth` | `127.0.0.1:3023` | Lander / shop UI |
| Spree commerce | `commonwealth-commerce` | `127.0.0.1:3024` | `/admin`, `/api`, `/rails`, `/cable`, `/jobs`, `/up` |

Nginx (root-owned, usually leave alone):

- `/etc/nginx/sites-available/commonwealth` → enabled
- Cloudflare origin certs under `/etc/ssl/cloudflare/`

### URL map (important)

| Path | Goes to |
|------|---------|
| `/`, shop pages, lander | Storefront container |
| `/admin`, `/admin_user`, `/api`, `/rails`, `/cable`, `/jobs`, `/up` | Spree |
| `/catalog-admin` | Storefront SPA catalog UI (not Spree) |

Do **not** put the React catalog admin on `/admin` — that path is Spree.

## Before every deploy

1. Merge/push your work to GitHub (`main` unless told otherwise).
2. SSH in as `deploy`.
3. Work only under `/home/deploy/commonwealth`.
4. Never commit or overwrite `commerce/.env` (secrets live only on the server).
5. Do not change host nginx, SSL certs, ports, or other sites unless Frederik asks.

```bash
ssh deploy@24.144.82.195
cd /home/deploy/commonwealth
git status
git pull --ff-only origin main
```

If `git pull` fails because of local server-only files, stop and reconcile — do not force-reset production without approval.

---

## A) Deploy storefront changes (most common)

Anything under `src/`, `public/`, `index.html`, `package.json`, Vite config, or root `Dockerfile` / `docker-compose.prod.yml`.

Vite env is **baked at image build time** via build-args:

| Build-arg | Purpose |
|-----------|---------|
| `VITE_STOREFRONT_UNLOCKED` | `true` = full shop; `false`/unset = lander only |
| `VITE_COMMERCE_API_URL` | Leave empty for same-origin `/api` |
| `VITE_COMMERCE_PUBLISHABLE_KEY` | Spree publishable key from admin |

### Rebuild & restart (lander mode — current default)

```bash
cd /home/deploy/commonwealth
git pull --ff-only origin main

docker compose -f docker-compose.prod.yml build --no-cache web
docker compose -f docker-compose.prod.yml up -d web
docker compose -f docker-compose.prod.yml ps
curl -sI http://127.0.0.1:3023/ | head -5
```

### Unlock full storefront (when ready)

```bash
cd /home/deploy/commonwealth
git pull --ff-only origin main

docker compose -f docker-compose.prod.yml build --no-cache \
  --build-arg VITE_STOREFRONT_UNLOCKED=true \
  --build-arg VITE_COMMERCE_API_URL= \
  --build-arg VITE_COMMERCE_PUBLISHABLE_KEY='pk_REPLACE_WITH_LIVE_KEY' \
  web

docker compose -f docker-compose.prod.yml up -d web
```

Get the live publishable key from Spree admin → Developers / API keys (or ask Frederik). Do not invent one.

### Smoke-check

```bash
curl -sI https://commonwealthseedco.com/ | head -10
curl -sI https://commonwealthseedco.com/admin | head -10
```

Expect `/` → storefront; `/admin` → Spree (login / redirect to `/admin_user/sign_in`), not the React home bounce.

---

## B) Deploy commerce / Spree changes

Production Spree currently runs the **stock image** `ghcr.io/spree/spree:latest` via `commerce/docker-compose.prod.yml`. There is no custom Rails image build in prod yet.

### Restart / pull newer Spree image

```bash
cd /home/deploy/commonwealth/commerce
docker compose -f docker-compose.prod.yml pull web
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml ps
curl -sf http://127.0.0.1:3024/up
```

### Apply compose / mounted config changes

Example: `commerce/config/initializers/session_store_override.rb` is bind-mounted into the container.

```bash
cd /home/deploy/commonwealth
git pull --ff-only origin main
cd commerce
docker compose -f docker-compose.prod.yml up -d
# if only an initializer changed:
docker compose -f docker-compose.prod.yml restart web
```

### Rails runner / seed (examples)

```bash
cd /home/deploy/commonwealth/commerce
docker compose -f docker-compose.prod.yml exec web bin/rails runner /path/in/container.rb
# or copy then run:
docker compose -f docker-compose.prod.yml cp ./scripts/seed_commonwealth.rb web:/tmp/seed_commonwealth.rb
docker compose -f docker-compose.prod.yml exec web bin/rails runner /tmp/seed_commonwealth.rb
```

### Env / secrets

- File: `/home/deploy/commonwealth/commerce/.env` (mode `600`, not in git)
- After editing `.env`: `docker compose -f docker-compose.prod.yml up -d`
- Never paste secrets into GitHub, chat logs, or commit messages

---

## C) Host nginx (rare — ask first)

Only when routing must change (new Spree paths, domain, SSL).

1. Edit `/etc/nginx/sites-available/commonwealth` as **root** (or ask Frederik).
2. `nginx -t && systemctl reload nginx`
3. Mirror the change into repo `deploy/nginx-host.conf` so the next agent stays in sync.

Storefront container nginx (`deploy/nginx-default.conf`) is separate — that ships inside the storefront image on rebuild.

---

## Safety rules for agents

1. **Isolated stack only** — project names `commonwealth` and `commonwealth-commerce`. Do not touch other Docker projects or nginx site blocks.
2. **No destructive DB ops** without explicit human approval (`drop`, `reset`, volume deletes).
3. **No `git push --force`**, no `docker compose down -v` on production.
4. Prefer `git pull --ff-only`. If the server has local diffs, inspect before overwriting.
5. Keep ports bound to `127.0.0.1` only (never publish `3023`/`3024` publicly).
6. After storefront unlock or API key changes, always **rebuild** the storefront image — env is compile-time for Vite.

## Quick reference

```bash
# SSH
ssh deploy@24.144.82.195

# Storefront logs
cd /home/deploy/commonwealth && docker compose -f docker-compose.prod.yml logs -f --tail=100 web

# Commerce logs
cd /home/deploy/commonwealth/commerce && docker compose -f docker-compose.prod.yml logs -f --tail=100 web

# Status
docker ps --filter name=commonwealth
```

## Handoff checklist (when asking Frederik for help)

- What changed (PR / commit SHA)
- Storefront rebuild? Commerce restart? Both?
- Did `git pull` succeed on the server?
- Exact error output from `docker compose` / `curl`
