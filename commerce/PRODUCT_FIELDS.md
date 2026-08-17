# Product custom fields (metafields)

Store-wide product attributes are defined once, then editable on every product.

## Where to manage (live admin)

1. Open https://commonwealthseedco.com/admin
2. Go to **Settings → Metafields** (Custom Field Definitions)
3. Resource: **Product**
4. Add a field (example: namespace `properties`, key `thc_range`, label `THC range`, type Short/Long text, visibility **both** so the storefront API can read it)

After you save a definition, enter values per product:

1. **Products** → open a product
2. Top-right **⋯** (three-dot) menu → **Metafields**
3. Fill Lineage / Line / Pack / Brand / Flowering time / Yield / Effects → **Save**

(They are not inline on the main product edit form.)

### Seeded defaults (already on live)

| Label          | Key (`properties.*`) | Example |
|----------------|----------------------|---------|
| Lineage        | `lineage`            | `(Zkittlez × Kush Mints) × (Secret Lemon × Tallymon #3) #2` |
| Line           | `line`               | `Grape Sunshine` |
| Pack           | `pack`               | `3-pack feminized` |
| Brand          | `brand`              | `Commonwealth Seed Co` |
| Flowering time | `flowering_time`     | *(fill per product)* |
| Yield          | `yield`              | *(fill per product)* |
| Effects        | `effects`            | *(fill per product)* |

Re-run locally / on server:

```bash
cd commerce && npm run seed:product-fields
```

## Storefront / Google

- API: products are fetched with `expand=custom_fields`
- PDP includes JSON-LD (`Product` + `additionalProperty`) for Google — no visual change yet
- Visual placement on product pages comes later; data is already on `product.attributes`

Do not put these only in free-form description text going forward — use the metafields so Google and the shop share one source of truth.
