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

export async function registerCustomer(payload: {
  email: string
  password: string
  password_confirmation?: string
  first_name?: string
  last_name?: string
}): Promise<AuthSession> {
  const json = await commerceFetch<{
    token: string
    refresh_token: string
    user: AuthApiUser
  }>('/api/v3/store/customers', {
    method: 'POST',
    body: payload,
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

export type CustomerOrder = {
  id: string
  number: string
  email: string
  currency: string
  state: string
  payment_state?: string | null
  completed_at: string | null
  display_total: string | null
  total_quantity?: number
  item_count?: number
}

export type CustomerAddress = {
  id: string
  first_name: string | null
  last_name: string | null
  full_name: string
  address1: string | null
  address2: string | null
  city: string | null
  postal_code: string | null
  phone: string | null
  company: string | null
  country_iso: string
  country_name?: string
  state_abbr: string | null
  state_name: string | null
  is_default_billing: boolean
  is_default_shipping: boolean
}

export type AddressInput = {
  first_name: string
  last_name: string
  address1: string
  address2?: string
  city: string
  postal_code: string
  country_iso: string
  phone?: string
  company?: string
  state_abbr?: string
  state_name?: string
  is_default_billing?: boolean
  is_default_shipping?: boolean
}

export type WishlistItem = {
  id: string
  variant_id: string
  product_id: string
  wishlist_id: string
  quantity: number
  variant?: {
    id: string
    sku: string | null
    options_text?: string
    thumbnail_url?: string | null
    product?: { name?: string; slug?: string }
  }
}

export type Wishlist = {
  id: string
  name: string
  token: string
  is_default: boolean
  is_private: boolean
  items: WishlistItem[]
}

export async function fetchCustomerOrders(): Promise<CustomerOrder[]> {
  try {
    const json = await commerceFetch<{ data: CustomerOrder[] }>(
      '/api/v3/store/customers/me/orders?limit=50&sort=-completed_at',
      { withAuth: true },
    )
    return json.data || []
  } catch {
    return []
  }
}

export async function fetchCustomerAddresses(): Promise<CustomerAddress[]> {
  try {
    const json = await commerceFetch<{ data: CustomerAddress[] }>(
      '/api/v3/store/customers/me/addresses?limit=50',
      { withAuth: true },
    )
    return json.data || []
  } catch {
    return []
  }
}

export async function createCustomerAddress(input: AddressInput): Promise<CustomerAddress> {
  return commerceFetch<CustomerAddress>('/api/v3/store/customers/me/addresses', {
    method: 'POST',
    body: input,
    withAuth: true,
  })
}

export async function deleteCustomerAddress(id: string): Promise<void> {
  await commerceFetch<void>(`/api/v3/store/customers/me/addresses/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    withAuth: true,
  })
}

export async function fetchWishlists(): Promise<Wishlist[]> {
  try {
    const json = await commerceFetch<{ data: Wishlist[] }>('/api/v3/store/wishlists?limit=20', {
      withAuth: true,
    })
    return (json.data || []).map((w) => ({
      ...w,
      items: w.items || [],
    }))
  } catch {
    return []
  }
}

export async function ensureDefaultWishlist(): Promise<Wishlist> {
  const list = await fetchWishlists()
  const existing = list.find((w) => w.is_default) || list[0]
  if (existing) return existing
  return commerceFetch<Wishlist>('/api/v3/store/wishlists', {
    method: 'POST',
    body: { name: 'Wishlist', is_default: true, is_private: true },
    withAuth: true,
  })
}

export async function addWishlistItem(wishlistId: string, variantId: string, quantity = 1) {
  return commerceFetch<WishlistItem>(
    `/api/v3/store/wishlists/${encodeURIComponent(wishlistId)}/items`,
    {
      method: 'POST',
      body: { variant_id: variantId, quantity },
      withAuth: true,
    },
  )
}

export async function removeWishlistItem(wishlistId: string, itemId: string): Promise<void> {
  await commerceFetch<void>(
    `/api/v3/store/wishlists/${encodeURIComponent(wishlistId)}/items/${encodeURIComponent(itemId)}`,
    {
      method: 'DELETE',
      withAuth: true,
    },
  )
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

export type WholesaleTierInfo = {
  tier: 'wholesale' | 'distro'
  name: string
  minimum_order_amount: number
}

export async function fetchWholesaleTiers(): Promise<WholesaleTierInfo[]> {
  try {
    const json = await commerceFetch<{
      data: { tier: string; name: string; minimum_order_amount: string }[]
    }>('/api/v3/store/wholesale_tiers')
    return (json.data || []).map((row) => ({
      tier: row.tier as 'wholesale' | 'distro',
      name: row.name,
      minimum_order_amount: Number(row.minimum_order_amount) || 0,
    }))
  } catch {
    return []
  }
}

export type StoreEvent = {
  id: string
  title: string
  slug: string
  summary: string | null
  location: string | null
  starts_at: string
  ends_at: string | null
  description: string | null
  featured_image_url: string | null
  gallery_image_urls: string[]
}

function mapEvent(raw: Record<string, unknown>): StoreEvent {
  return {
    id: String(raw.id ?? raw.slug ?? ''),
    title: String(raw.title ?? ''),
    slug: String(raw.slug ?? ''),
    summary: (raw.summary as string) || null,
    location: (raw.location as string) || null,
    starts_at: String(raw.starts_at ?? ''),
    ends_at: (raw.ends_at as string) || null,
    description: (raw.description as string) || null,
    featured_image_url: (raw.featured_image_url as string) || null,
    gallery_image_urls: Array.isArray(raw.gallery_image_urls)
      ? (raw.gallery_image_urls as string[])
      : [],
  }
}

export async function fetchEvents(limit = 20): Promise<StoreEvent[]> {
  try {
    const json = await commerceFetch<{ data: Record<string, unknown>[] }>(
      `/api/v3/store/events?limit=${limit}`,
    )
    return (json.data || []).map(mapEvent)
  } catch {
    return []
  }
}

export async function fetchEventBySlug(slug: string): Promise<StoreEvent | null> {
  try {
    const json = await commerceFetch<Record<string, unknown>>(
      `/api/v3/store/events/${encodeURIComponent(slug)}`,
    )
    return mapEvent(json)
  } catch {
    return null
  }
}
