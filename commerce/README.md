# Commonwealth commerce API

Dockerized store + admin API used by the Commonwealth Seed Co storefront.

## Quick start

```bash
npm install
npm run dev
```

- Admin: http://localhost:3001/admin  
  Email: `admin@example.com` (or the account created on first run)  
  Password: see first-run output / project notes  
- Store API: http://localhost:3001/api/v3/store

Default local port is `3001` (configured in `.env`).

## Seed catalog

```bash
npm run seed:commonwealth
```

Loads the Wild Thornberry Line into the catalog.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start API (Docker) |
| `npm run stop` | Stop services |
| `npm run seed:commonwealth` | Seed Commonwealth products |
| `npm run console` | Rails console |
| `npm run logs` | Web logs |

Customization lives in `backend/` (Rails). Prefer `npm run` wrappers from the repo root (`commerce:dev`, `commerce:seed`, etc.).
