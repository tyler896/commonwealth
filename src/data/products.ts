export type CommercePrice = {
  amount?: string
  display_amount?: string
  currency?: string
}

export type CommerceProduct = {
  id: string
  name: string
  slug: string
  description?: string | null
  description_html?: string | null
  status?: string
  metadata?: Record<string, unknown> | null
  price?: CommercePrice | null
  default_variant_id?: string | null
  purchasable?: boolean
  in_stock?: boolean
  available?: boolean
}

export type CollectionId = 'wild-thornberry' | 'grape-sunshine'

export type Product = {
  id: string
  catalogId: string
  variantId?: string
  name: string
  lineage: string
  line: CollectionId
  price: number
  packSize: string
  description: string
  featured?: boolean
  comingSoon: boolean
  purchasable: boolean
}

export type Collection = {
  id: CollectionId
  slug: string
  name: string
  parent: string
  banner: string
  accent: 'purple' | 'red'
  blurb: string
}

export const collections: Collection[] = [
  {
    id: 'wild-thornberry',
    slug: 'wild-thornberry',
    name: 'the Wild Thornberry Line',
    parent: 'Strawnana × Animal Face Kush Mints',
    banner: '/images/drop-wild-thornberry.png',
    accent: 'purple',
    blurb: 'Feminized crosses built on Wild Thornberry.',
  },
  {
    id: 'grape-sunshine',
    slug: 'grape-sunshine',
    name: 'The Grape Sunshine Line',
    parent: "Secret Lemon × Tallymon aka 'Grape Sunshine'",
    banner: '/images/drop-grape-sunshine.png',
    accent: 'red',
    blurb:
      'In collaboration with Archive Seed Bank — crosses to Secret Lemon × Tallymon #3 #2 pollen.',
  },
]

export const lineInfo = collections[0]
export const grapeSunshineLine = collections[1]

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug || c.id === slug)
}

function pickLineage(product: CommerceProduct): string {
  const meta = product.metadata || {}
  if (typeof meta.lineage === 'string' && meta.lineage.trim()) return meta.lineage
  const desc = product.description || ''
  const match = desc.match(/Lineage:\s*([^\n]+?)(?:\s+Line:|$)/i)
  return match?.[1]?.trim() || product.name || 'Commonwealth Seed Co'
}

function pickPackSize(product: CommerceProduct): string {
  const meta = product.metadata || {}
  if (typeof meta.pack_size === 'string') return meta.pack_size
  return '3-pack'
}

function pickLine(product: CommerceProduct): CollectionId {
  const meta = product.metadata || {}
  if (meta.line === 'grape-sunshine') return 'grape-sunshine'
  if (meta.line === 'wild-thornberry') return 'wild-thornberry'

  const slug = product.slug || ''
  if (slug.includes('grape-sunshine')) return 'grape-sunshine'

  const desc = product.description || ''
  if (/Line:\s*Grape Sunshine/i.test(desc)) return 'grape-sunshine'
  if (/Line:\s*Wild Thornberry/i.test(desc)) return 'wild-thornberry'

  return 'wild-thornberry'
}

export function mapCommerceProduct(product: CommerceProduct): Product {
  const meta = product.metadata || {}
  const amount = product.price?.amount ? Number(product.price.amount) : 80

  return {
    id: product.slug,
    catalogId: product.id,
    variantId: product.default_variant_id || undefined,
    name: product.name,
    lineage: pickLineage(product),
    line: pickLine(product),
    price: Number.isFinite(amount) ? amount : 80,
    packSize: pickPackSize(product),
    description: (product.description || '').split('\n\nLineage:')[0].trim(),
    featured: meta.featured === true || meta.featured === 'true',
    comingSoon: true,
    purchasable: Boolean(product.purchasable),
  }
}

export function productsForCollection(products: Product[], collectionId: CollectionId) {
  return products.filter((p) => p.line === collectionId)
}
