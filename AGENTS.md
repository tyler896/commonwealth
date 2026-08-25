# Agent notes — Commonwealth Seed Co

Repo: `https://github.com/tyler896/commonwealth`  
Live: `https://commonwealthseedco.com`

## Local development

See [README.md](./README.md).

- Storefront: Vite at repo root (`npm run dev`)
- Commerce: Docker stack in `/commerce` (`npm run dev` from that folder)
- Do not name the underlying commerce platform in user-facing copy or Vite env names meant for the browser

## Production deploy

**Push to `main` auto-deploys** within ~1 minute (no SSH required from the agent).

Details / manual SSH / unlock build-args: [DEPLOY.md](./DEPLOY.md).

Summary:

- Live host: `24.144.82.195` · app path `/home/deploy/commonwealth`
- Storefront = Docker Compose project `commonwealth` on `127.0.0.1:3023`
- Spree = project `commonwealth-commerce` on `127.0.0.1:3024`
- `/admin` is Spree; storefront catalog admin is `/catalog-admin`
- Vite env vars are build-args — unlock / publishable key changes need a rebuild with those args
- Never deploy to the old host `64.23.175.154`
- Never commit `commerce/.env`

## Commerce folder

See [commerce/AGENTS.md](./commerce/AGENTS.md).

## Product custom fields

Lineage / Line / Pack / Brand (and any future fields) are store-wide **metafield definitions**.
Add more in admin **Settings → Metafields**. Details: [commerce/PRODUCT_FIELDS.md](./commerce/PRODUCT_FIELDS.md).

## Events

- Admin: Spree sidebar **Events** — title, date, location, summary, rich description, featured + gallery images
- Storefront: `/events` (newest first), `/events/:slug`, home widget (1 / 2 / 3+ layout)

## Wholesale / B2B

- Apply: `/wholesale` · Login: `/wholesale/login`
- Admin: Spree **Wholesale Customers** sidebar — approve into Wholesale or Distro; set per-tier minimum order ($)
- Prices: **Products → Price Lists** (seed with `npm run seed:wholesale` from `commerce/`)
- Details: [commerce/AGENTS.md](./commerce/AGENTS.md)

