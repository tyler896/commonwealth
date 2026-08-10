# Commerce backend (Rails)

Rails app that serves the Store and Admin APIs for Commonwealth Seed Co.

## Layout

| Path | Role |
| --- | --- |
| `config/initializers/` | App + commerce configuration |
| `app/` | Custom models, subscribers, services, views |
| `db/` | Schema, migrations, seeds |
| `Gemfile` | Gems and versions |

## Extending

Prefer (in order):

1. **Subscribers** — react to domain events without patching core
2. **Service overrides** — register replacements via dependencies
3. **Decorators** — last resort for model extensions

Catalog seed for this project: `../scripts/seed_commonwealth.rb` via `npm run seed:commonwealth` from `commerce/`.

## Tests

Run from the commerce root with the project’s Docker workflow (`npm run` / compose exec). Test DB name may still use the image defaults.
