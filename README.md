# Commonwealth Seed Co

Custom branded storefront + commerce API.

**Repo:** https://github.com/tyler896/commonwealth (`main` is current)

**Agents deploying to production:** follow [DEPLOY.md](./DEPLOY.md) (and [AGENTS.md](./AGENTS.md)).

## For developers

Everything needed to run and ship this lives in this repo:

| Path | What it is |
| --- | --- |
| `/` | Vite storefront (lander + shop) |
| `/src/data/catalog.ts` | Built-in product catalog (local shop can work without commerce) |
| `/commerce` | Commerce API (Docker / Rails) — **live on production** |
| `/commerce/scripts` | Catalog seed (`seed:commonwealth`) |
| `.env.example` | Storefront env template |

- **Spree admin (live):** `https://commonwealthseedco.com/admin`
- **Catalog editor (storefront SPA):** `/catalog-admin` (local or live)
- **Optional local commerce admin:** `http://localhost:3001/admin` after `npm run commerce:dev`
- **Lander preview unlock:** preview password on the lander, or `VITE_STOREFRONT_UNLOCKED=true`
- **Secrets:** `.env` files are gitignored — copy from `.env.example` / `commerce/backend/.env.example`
- **Production host:** see [DEPLOY.md](./DEPLOY.md) — do not deploy to the old shared Spree box

## Public mode (default)

By default the app serves only the drop-alert lander (cloned from the live site).
The full shop stays locked until you either:

- click **Preview site** on the lander and enter the preview password, or
- set `VITE_STOREFRONT_UNLOCKED=true`

## Stack

- **Storefront:** Vite + React + TypeScript + Tailwind (`/`)
- **Commerce API:** Docker stack in `/commerce`

## Prerequisites

- Node.js 20+
- Docker (Colima or Docker Desktop)

## Start commerce API

```bash
# if using Colima
colima start
export DOCKER_HOST="unix://${HOME}/.colima/default/docker.sock"

cd commerce
npm install
npm run dev
```

Admin: http://localhost:3001/admin (credentials from first-run setup)  
Store API: http://localhost:3001/api/v3/store

Publishable key goes in the root `.env` as `VITE_COMMERCE_PUBLISHABLE_KEY`.

## Seed Commonwealth products

```bash
cd commerce
npm run seed:commonwealth
```

Seeds the Wild Thornberry Line (10 feminized strains) into the catalog.

## Start storefront

```bash
cp .env.example .env   # set VITE_COMMERCE_PUBLISHABLE_KEY
npm install
npm run dev
```

Shop: http://127.0.0.1:5173/shop  

Vite proxies `/api` → the commerce API (`VITE_COMMERCE_PROXY_TARGET`, default `http://localhost:3001`). Product cards load from the store API and link to `/shop/:slug`.
