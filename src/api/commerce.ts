import { staticCatalog } from '../data/catalog'
import { mapCommerceProduct, type Product, type CommerceProduct } from '../data/products'
import { applyCatalogOverrides, loadCatalogOverrides } from '../data/catalogOverrides'

const publishableKey = import.meta.env.VITE_COMMERCE_PUBLISHABLE_KEY as string | undefined
const apiBase = (import.meta.env.VITE_COMMERCE_API_URL as string | undefined)?.replace(/\/$/, '') || ''

function apiUrl(path: string) {
  return `${apiBase}${path}`
}

async function commerceFetch<T>(path: string): Promise<T> {
  if (!publishableKey) {
    throw new Error('Missing store API key')
  }

  const res = await fetch(apiUrl(path), {
    headers: {
      Accept: 'application/json',
      'X-Spree-Api-Key': publishableKey,
    },
  })

  if (!res.ok) {
    throw new Error(`Catalog unavailable (${res.status})`)
  }

  return res.json() as Promise<T>
}

type ListResponse = {
  data: CommerceProduct[]
  meta?: { count?: number }
}

function withOverrides(products: Product[]): Product[] {
  return applyCatalogOverrides(products, loadCatalogOverrides())
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const json = await commerceFetch<ListResponse>('/api/v3/store/products?limit=100')
    const products = (json.data || []).map(mapCommerceProduct)
    if (products.length) return withOverrides(products)
  } catch {
    // Fall through to built-in catalog — no hosted commerce required.
  }

  return withOverrides(staticCatalog)
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const json = await commerceFetch<CommerceProduct>(
      `/api/v3/store/products/${encodeURIComponent(slug)}`,
    )
    const product = mapCommerceProduct(json)
    return withOverrides([product])[0] || null
  } catch {
    const fromStatic = staticCatalog.find((p) => p.id === slug) || null
    return fromStatic ? withOverrides([fromStatic])[0] : null
  }
}
