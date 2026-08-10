# Commerce API (agent notes)

Commonwealth Seed Co catalog + checkout API. Storefront lives in the repo root.

| Path | Role |
| --- | --- |
| `backend/` | Rails API (catalog, orders, admin) |
| `scripts/` | Seed scripts (e.g. Commonwealth products) |

## Commands

```bash
npm run dev                 # Start API (Docker)
npm run stop                # Stop services
npm run seed:commonwealth   # Seed Wild Thornberry catalog
npm run console             # Rails console
```

Store API is under `/api/v3/store`. Authenticate storefront requests with the publishable key header required by this API stack.

Prefer npm scripts over calling the underlying CLI binary by name in docs or UI.
