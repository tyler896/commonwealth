# Agent notes — commerce

This folder is the Commonwealth Seed Co commerce API (Docker + Rails under `backend/`).

Use `npm run dev`, `npm run stop`, and `npm run seed:commonwealth` from this directory (or `commerce:*` scripts from the repo root).

Do not surface the underlying platform name in storefront copy, env var names for the Vite app, or user-facing errors.

## Production

Live deploy steps (SSH host, compose projects, rebuilds): see [../DEPLOY.md](../DEPLOY.md).

## Product fields

Structured product attributes (Lineage, Line, Pack, Brand, …): [PRODUCT_FIELDS.md](./PRODUCT_FIELDS.md).
Use `npm run seed:product-fields` to create/sync definitions and copy values onto products.

## Wholesale / B2B

- Public apply form: storefront `/wholesale`
- Login: storefront `/wholesale/login` (JWT); approved accounts see tier prices automatically
- Staff: Spree Admin sidebar **Wholesale Customers** — approve (assign Wholesale or Distro), reject, remove, change tier
- Pricing: **Products → Price Lists** (`Wholesale` and `Distro` lists). Seed with `npm run seed:wholesale`
- Minimum order ($): set per tier at the top of **Wholesale Customers**
- Approving adds the customer to the matching Customer Group; that membership drives Price List resolution
