# Agent notes — commerce

This folder is the Commonwealth Seed Co commerce API (Docker + Rails under `backend/`).

Use `npm run dev`, `npm run stop`, and `npm run seed:commonwealth` from this directory (or `commerce:*` scripts from the repo root).

Do not surface the underlying platform name in storefront copy, env var names for the Vite app, or user-facing errors.

## Production

Live deploy steps (SSH host, compose projects, rebuilds): see [../DEPLOY.md](../DEPLOY.md).

## Product fields

Structured product attributes (Lineage, Line, Pack, Brand, …): [PRODUCT_FIELDS.md](./PRODUCT_FIELDS.md).
Use `npm run seed:product-fields` to create/sync definitions and copy values onto products.
