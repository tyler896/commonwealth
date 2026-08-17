export type CommercePrice = {
  amount?: string
  display_amount?: string
  currency?: string
}

export type CommerceCustomField = {
  id?: string
  label?: string
  key?: string
  field_type?: string
  value?: string | number | boolean | null
}

export type CommerceProduct = {
  id: string
  name: string
  slug: string
  description?: string | null
  description_html?: string | null
  status?: string
  metadata?: Record<string, unknown> | null
  custom_fields?: CommerceCustomField[] | null
  price?: CommercePrice | null
  default_variant_id?: string | null
  purchasable?: boolean
  in_stock?: boolean
  available?: boolean
}

export type CollectionId = 'wild-thornberry' | 'grape-sunshine'

export type ProductAttribute = {
  key: string
  label: string
  value: string
}

export type Product = {
  id: string
  catalogId: string
  variantId?: string
  name: string
  lineage: string
  line: CollectionId
  brand: string
  price: number
  packSize: string
  description: string
  /** All public custom fields — for PDP layout later + Google JSON-LD */
  attributes: ProductAttribute[]
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

function customFieldMap(product: CommerceProduct): Record<string, { label: string; value: string }> {
  const out: Record<string, { label: string; value: string }> = {}
  for (const field of product.custom_fields || []) {
    if (!field.key || field.value == null || field.value === '') continue
    const shortKey = field.key.includes('.') ? field.key.split('.').pop()! : field.key
    out[shortKey] = {
      label: field.label || shortKey,
      value: String(field.value),
    }
    out[field.key] = out[shortKey]
  }
  return out
}

function pickLineage(product: CommerceProduct, fields: ReturnType<typeof customFieldMap>): string {
  if (fields.lineage?.value) return fields.lineage.value
  const meta = product.metadata || {}
  if (typeof meta.lineage === 'string' && meta.lineage.trim()) return meta.lineage
  const desc = product.description || ''
  const match = desc.match(/Lineage:\s*([^\n]+?)(?:\s+Line:|$)/i)
  return match?.[1]?.trim() || product.name || 'Commonwealth Seed Co'
}

function pickPackSize(product: CommerceProduct, fields: ReturnType<typeof customFieldMap>): string {
  const raw =
    fields.pack?.value ||
    (typeof product.metadata?.pack_size === 'string' ? product.metadata.pack_size : '') ||
    (typeof product.metadata?.pack === 'string' ? product.metadata.pack : '') ||
    '3-pack'
  // UI appends "feminized seeds" — keep short form when possible
  return raw.replace(/\s*feminized\s*$/i, '').trim() || '3-pack'
}

function pickBrand(product: CommerceProduct, fields: ReturnType<typeof customFieldMap>): string {
  if (fields.brand?.value) return fields.brand.value
  const meta = product.metadata || {}
  if (typeof meta.brand === 'string' && meta.brand.trim()) return meta.brand
  return 'Commonwealth Seed Co'
}

function pickLine(product: CommerceProduct, fields: ReturnType<typeof customFieldMap>): CollectionId {
  const lineRaw = fields.line?.value || product.metadata?.line
  if (lineRaw === 'grape-sunshine' || /grape\s*sunshine/i.test(String(lineRaw))) {
    return 'grape-sunshine'
  }
  if (lineRaw === 'wild-thornberry' || /wild\s*thornberry/i.test(String(lineRaw))) {
    return 'wild-thornberry'
  }

  const slug = product.slug || ''
  if (slug.includes('grape-sunshine')) return 'grape-sunshine'

  const desc = product.description || ''
  if (/Line:\s*Grape Sunshine/i.test(desc)) return 'grape-sunshine'
  if (/Line:\s*Wild Thornberry/i.test(desc)) return 'wild-thornberry'

  return 'wild-thornberry'
}

function buildAttributes(
  product: CommerceProduct,
  lineage: string,
  line: CollectionId,
  packSize: string,
  brand: string,
): ProductAttribute[] {
  const fromApi = (product.custom_fields || [])
    .filter((f) => f.key && f.value != null && String(f.value).trim() !== '')
    .map((f) => ({
      key: f.key!.includes('.') ? f.key!.split('.').pop()! : f.key!,
      label: f.label || f.key!,
      value: String(f.value),
    }))

  if (fromApi.length) {
    // Dedupe by key
    const seen = new Set<string>()
    return fromApi.filter((a) => {
      if (seen.has(a.key)) return false
      seen.add(a.key)
      return true
    })
  }

  // Fallback when API has no custom_fields expand
  return [
    { key: 'lineage', label: 'Lineage', value: lineage },
    {
      key: 'line',
      label: 'Line',
      value: line === 'grape-sunshine' ? 'Grape Sunshine' : 'Wild Thornberry',
    },
    { key: 'pack', label: 'Pack', value: `${packSize} feminized` },
    { key: 'brand', label: 'Brand', value: brand },
  ].filter((a) => a.value.trim())
}

export function mapCommerceProduct(product: CommerceProduct): Product {
  const meta = product.metadata || {}
  const fields = customFieldMap(product)
  const amount = product.price?.amount ? Number(product.price.amount) : 80
  const lineage = pickLineage(product, fields)
  const line = pickLine(product, fields)
  const packSize = pickPackSize(product, fields)
  const brand = pickBrand(product, fields)

  return {
    id: product.slug,
    catalogId: product.id,
    variantId: product.default_variant_id || undefined,
    name: product.name,
    lineage,
    line,
    brand,
    price: Number.isFinite(amount) ? amount : 80,
    packSize,
    description: (product.description || '').split('\n\nLineage:')[0].trim(),
    attributes: buildAttributes(product, lineage, line, packSize, brand),
    featured: meta.featured === true || meta.featured === 'true',
    comingSoon: true,
    purchasable: Boolean(product.purchasable),
  }
}

export function productsForCollection(products: Product[], collectionId: CollectionId) {
  return products.filter((p) => p.line === collectionId)
}
