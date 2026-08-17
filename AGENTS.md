# Agent notes — Commonwealth Seed Co

Repo: `https://github.com/tyler896/commonwealth`  
Live: `https://commonwealthseedco.com`

## Local development

See [README.md](./README.md).

- Storefront: Vite at repo root (`npm run dev`)
- Commerce: Docker stack in `/commerce` (`npm run dev` from that folder)
- Do not name the underlying commerce platform in user-facing copy or Vite env names meant for the browser

## Production deploy

**Read [DEPLOY.md](./DEPLOY.md) before shipping anything live.**

Summary:

- SSH as `deploy@24.144.82.195`
- App path: `/home/deploy/commonwealth`
- Storefront = Docker Compose project `commonwealth` on `127.0.0.1:3023`
- Spree = project `commonwealth-commerce` on `127.0.0.1:3024`
- `/admin` is Spree; storefront catalog admin is `/catalog-admin`
- Vite env vars are build-args — rebuild the storefront image to change them
- Never deploy to the old host `64.23.175.154`
- Never commit `commerce/.env`

## Commerce folder

See [commerce/AGENTS.md](./commerce/AGENTS.md).
