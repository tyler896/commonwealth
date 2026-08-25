import type { Product } from '../data/products'

/** Invisible Product JSON-LD for Google (Merchant / rich results). No UI. */
export function ProductJsonLd({ product }: { product: Product }) {
  const url =
    typeof window !== 'undefined'
      ? `${window.location.origin}/shop/${product.id}`
      : `https://commonwealthseedco.com/shop/${product.id}`

  const additionalProperty = product.attributes
    .filter((a) => a.value.trim())
    .map((a) => ({
      '@type': 'PropertyValue',
      name: a.label,
      value: a.value,
      propertyID: a.key,
    }))

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Commonwealth Seed Co',
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'USD',
      price: String(product.price),
      availability: product.purchasable
        ? 'https://schema.org/InStock'
        : 'https://schema.org/PreOrder',
      itemCondition: 'https://schema.org/NewCondition',
    },
    additionalProperty,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
