import { useEffect, useState } from 'react'
import {
  collections,
  productsForCollection,
  type Product,
} from '../data/products'
import { fetchProducts } from '../api/commerce'
import { CollectionSection } from '../components/CollectionSection'

export function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    setLoading(true)
    fetchProducts()
      .then((items) => {
        if (!alive) return
        setProducts(items)
        setError(null)
      })
      .catch((err: Error) => {
        if (!alive) return
        setError(err.message || 'Could not load products')
        setProducts([])
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="bg-paper pb-16 md:pb-24">
      <section className="pt-16 md:pt-20">
        <div className="overflow-hidden">
          <img
            src="/images/hero-banner.png"
            alt="Common Wealth Seed Co — Seeds for the People"
            className="block h-auto max-h-[34vh] w-full object-cover object-center sm:max-h-[42vh] md:max-h-none"
          />
        </div>
      </section>

      {loading && (
        <p className="section-pad py-16 text-center font-display text-sm tracking-[0.2em] uppercase text-muted md:py-20">
          Loading catalog…
        </p>
      )}

      {error && (
        <div className="section-pad mx-auto max-w-xl py-12 md:py-16">
          <div className="border border-line bg-paper-soft px-5 py-7 text-center md:px-6 md:py-8">
            <p className="font-display text-sm tracking-[0.18em] uppercase text-ink">
              Catalog unavailable
            </p>
            <p className="mt-3 text-sm text-muted">{error}</p>
          </div>
        </div>
      )}

      {!loading &&
        !error &&
        collections.map((collection) => (
          <CollectionSection
            key={collection.id}
            collection={collection}
            products={productsForCollection(products, collection.id)}
          />
        ))}
    </div>
  )
}
