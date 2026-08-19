import { staticCatalog } from '../data/catalog'
import { mapCommerceProduct, type Product, type CommerceProduct } from '../data/products'
import { applyCatalogOverrides, loadCatalogOverrides } from '../data/catalogOverrides'
import { getAccessToken, type AuthSession, type AuthUser } from '../auth/session'

const publishableKey = import.meta.env.VITE_COMMERCE_PUBLISHABLE_KEY as string | undefined
const apiBase = (import.meta.env.VITE_COMMERCE_API_URL as string | undefined)?.replace(/\/$/, '') || ''

function apiUrl(path: string) {
  return `${apiBase}${path}`
}

type CommerceFetchOptions = {
  method?: string
  body?: unknown
  token?: string | null
  /** When true, attach stored JWT if present (for tier pricing). */
  withAuth?: boolean
}

async function commerceFetch<T>(path: string, options: CommerceFetchOptions = {}): Promise<T> {
  if (!publishableKey) {
    throw new Error('Missing store API key')
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Spree-Api-Key': publishableKey,
  }

  const token = options.token ?? (options.withAuth ? getAccessToken() : null)
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(apiUrl(path), {
    method: options.method || 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  if (!res.ok) {
    let details: unknown
    try {
      details = await res.json()
    } catch {
      details = null
    }
    const message =
      (details as { error?: { message?: string; details?: string[] } })?.error?.message ||
      (Array.isArray((details as { error?: { details?: string[] } })?.error?.details)
        ? (details as { error: { details: string[] } }).error.details.join(', ')
        : null) ||
      `Request failed (${res.status})`
    const err = new Error(message) as Error & { status?: number; details?: unknown }
    err.status = res.status
    err.details = details
    throw err
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

type ListResponse = {
  data: CommerceProduct[]
  meta?: { count?: number }
}

type AuthApiUser = AuthUser & {
  customer_groups?: { id: string; name: string }[]
}

function normalizeUser(user: AuthApiUser): AuthUser {
  return {
    id: String(user.id),
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    full_name: user.full_name,
    customer_groups: user.customer_groups || [],
  }
}

function withOverrides(products: Product[]): Product[] {
  return applyCatalogOverrides(products, loadCatalogOverrides())
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const json = await commerceFetch<ListResponse>(
      '/api/v3/store/products?limit=100&expand=custom_fields',
      { withAuth: true },
    )
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
      `/api/v3/store/products/${encodeURIComponent(slug)}?expand=custom_fields`,
      { withAuth: true },
    )
    const product = mapCommerceProduct(json)
    return withOverrides([product])[0] || null
  } catch {
    const fromStatic = staticCatalog.find((p) => p.id === slug) || null
    return fromStatic ? withOverrides([fromStatic])[0] : null
  }
}

export async function loginCustomer(email: string, password: string): Promise<AuthSession> {
  const json = await commerceFetch<{
    token: string
    refresh_token: string
    user: AuthApiUser
  }>('/api/v3/store/auth/login', {
    method: 'POST',
    body: { email, password },
  })

  return {
    token: json.token,
    refreshToken: json.refresh_token,
    user: normalizeUser(json.user),
  }
}

export async function fetchCurrentCustomer(token: string): Promise<AuthUser> {
  const json = await commerceFetch<AuthApiUser>('/api/v3/store/account', {
    token,
  }).catch(async () => {
    // Spree 5.x may expose profile as /customers/me
    return commerceFetch<AuthApiUser>('/api/v3/store/customers/me', { token })
  })
  return normalizeUser(json)
}

export type WholesaleApplicationPayload = {
  company_name: string
  contact_name: string
  email: string
  phone?: string
  website?: string
  license_number?: string
  notes?: string
  password: string
  password_confirmation?: string
}

export async function submitWholesaleApplication(payload: WholesaleApplicationPayload) {
  return commerceFetch<{
    message: string
    application: { id: number; status: string; email: string; company_name: string }
  }>('/api/v3/store/wholesale_applications', {
    method: 'POST',
    body: payload,
  })
}
