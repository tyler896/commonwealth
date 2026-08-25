import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getCollection,
  productsForCollection,
  type Product,
} from '../data/products'
import { fetchProducts } from '../api/commerce'
import { ProductCard } from '../components/ProductCard'

export function CollectionPage() {
  const { slug = '' } = useParams()
  const collection = getCollection(slug)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!collection) return
    let alive = true
    setLoading(true)
    fetchProducts()
      .then((items) => {
        if (!alive) return
        setProducts(productsForCollection(items, collection.id))
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
  }, [collection?.id])

  if (!collection) {
    return (
      <div className="section-pad mx-auto max-w-3xl py-32 text-center md:py-40">
        <h1 className="font-display text-3xl text-ink md:text-4xl">Collection not found</h1>
        <Link to="/" className="mt-6 inline-block text-brand-red">
          Back to home
        </Link>
      </div>
    )
  }

  const isRed = collection.accent === 'red'
  const accent = isRed ? 'text-brand-red' : 'text-brand-blue'
  const accentDeep = isRed ? 'text-brand-red-deep' : 'text-brand-blue-deep'
  const accentBorder = isRed ? 'border-brand-red/20' : 'border-brand-blue/20'

  return (
    <div className="bg-paper pb-16 md:pb-24">
      <section className="section-pad mx-auto max-w-7xl pt-24 md:pt-32">
        <Link
          to="/"
          className="font-display text-[10px] tracking-[0.22em] uppercase text-muted transition hover:text-ink md:text-xs"
        >
          ← Home
        </Link>

        <div className="mt-6 grid items-start gap-8 md:mt-10 md:grid-cols-[minmax(0,14rem)_1fr] md:gap-12 lg:grid-cols-[minmax(0,16rem)_1fr] lg:gap-16">
          <img
            src={collection.banner}
            alt={collection.name}
            className={`mx-auto w-full max-w-[11rem] border-2 ${accentBorder} shadow-md sm:max-w-[13rem] md:mx-0 md:max-w-none`}
          />

          <div className="min-w-0 text-center md:pt-2 md:text-left">
            <p className={`font-display text-[10px] tracking-[0.28em] uppercase md:text-xs ${accent}`}>
              Collection
            </p>
            <h1 className={`mt-2 font-blackletter text-3xl leading-tight md:text-5xl ${accentDeep}`}>
              {collection.name}
            </h1>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/70 md:text-sm">
              {collection.parent}
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted md:mx-0 md:text-base">
              {collection.blurb}
            </p>
            {!loading && !error && (
              <p className="mt-3 text-sm text-muted">{products.length} feminized strains</p>
            )}
          </div>
        </div>
      </section>

      <section className="section-pad mx-auto max-w-7xl pt-10 md:pt-14">
        {loading && (
          <p className="py-16 text-center font-display text-sm tracking-[0.2em] uppercase text-muted md:py-20">
            Loading catalog…
          </p>
        )}

        {error && (
          <div className="mx-auto max-w-xl border border-line bg-paper-soft px-5 py-7 text-center md:px-6 md:py-8">
            <p className="font-display text-sm tracking-[0.18em] uppercase text-ink">
              Catalog unavailable
            </p>
            <p className="mt-3 text-sm text-muted">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.catalogId} product={product} compact />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
