import type { Product } from './products'

export type CatalogOverride = Partial<
  Pick<Product, 'name' | 'price' | 'comingSoon' | 'featured' | 'description' | 'lineage'>
>

export const CATALOG_OVERRIDES_KEY = 'cw_catalog_overrides'

export function loadCatalogOverrides(): Record<string, CatalogOverride> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(CATALOG_OVERRIDES_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, CatalogOverride>
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function saveCatalogOverrides(overrides: Record<string, CatalogOverride>): void {
  window.localStorage.setItem(CATALOG_OVERRIDES_KEY, JSON.stringify(overrides))
  window.dispatchEvent(new Event('cw-catalog-overrides'))
}

export function applyCatalogOverrides(
  products: Product[],
  overrides: Record<string, CatalogOverride>,
): Product[] {
  return products.map((product) => {
    const patch = overrides[product.id]
    if (!patch) return product
    const next = { ...product, ...patch }
    if (patch.lineage) {
      next.attributes = next.attributes.map((a) =>
        a.key === 'lineage' ? { ...a, value: patch.lineage! } : a,
      )
    }
    return next
  })
}
