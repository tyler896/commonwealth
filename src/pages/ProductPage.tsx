import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCollection, type Product } from '../data/products'
import { fetchProductBySlug, fetchProducts } from '../api/commerce'
import { ProductCarousel } from '../components/ProductCarousel'
import { ProductJsonLd } from '../components/ProductJsonLd'
import { MetafieldIcon } from '../components/MetafieldIcon'

export function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    if (!id) return
    let alive = true
    setLoading(true)
    setMissing(false)

    Promise.all([fetchProductBySlug(id), fetchProducts()])
      .then(([item, all]) => {
        if (!alive) return
        if (!item) {
          setMissing(true)
          setProduct(null)
          setRelated([])
          return
        }
        setProduct(item)
        setRelated(all.filter((p) => p.line === item.line && p.id !== item.id).slice(0, 8))
      })
      .catch(() => {
        if (!alive) return
        setMissing(true)
      })
      .finally(() => {
        if (alive) setLoading(false)
      })

    return () => {
      alive = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="section-pad mx-auto max-w-3xl py-32 text-center text-muted md:py-40">
        Loading strain…
      </div>
    )
  }

  if (missing || !product) {
    return (
      <div className="section-pad mx-auto max-w-3xl py-32 text-center md:py-40">
        <h1 className="font-display text-3xl text-ink md:text-4xl">Strain not found</h1>
        <Link to="/" className="mt-6 inline-block text-leaf">
          Back to home
        </Link>
      </div>
    )
  }

  const collection = getCollection(product.line)
  const isRed = collection?.accent === 'red'
  const metafields = product.attributes.filter((a) => a.value.trim())

  return (
    <div className="section-pad mx-auto max-w-7xl pb-16 pt-24 md:pb-24 md:pt-36">
      <ProductJsonLd product={product} />
      <Link
        to={collection ? `/collections/${collection.slug}` : '/shop'}
        className={`font-display text-[10px] tracking-[0.22em] uppercase text-muted transition md:text-xs ${
          isRed ? 'hover:text-brand-red' : 'hover:text-brand-blue'
        }`}
      >
        ← {collection?.name || 'All Commonwealth seeds'}
      </Link>

      <div className="mt-6 grid gap-8 md:mt-10 md:gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center overflow-hidden border border-line bg-paper-soft lg:max-w-none">
          <img
            src="/images/logo-circle.png"
            alt=""
            className="h-[72%] w-[72%] object-contain"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p
            className={`font-display text-[10px] tracking-[0.28em] uppercase md:text-xs ${
              isRed ? 'text-brand-red' : 'text-brand-blue'
            }`}
          >
            {collection?.name}
          </p>
          <h1
            className={`mt-2 font-blackletter text-3xl leading-tight tracking-tight sm:text-4xl md:mt-3 md:text-5xl lg:text-6xl ${
              isRed ? 'text-brand-red-deep' : 'text-brand-blue-deep'
            }`}
          >
            {product.name}
          </h1>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink md:mt-4 md:text-sm md:tracking-[0.14em]">
            {product.lineage}
          </p>
          {collection && <p className="mt-2 text-sm text-muted">({collection.parent})</p>}
          <p className="mt-6 text-sm leading-relaxed text-ink/80 md:mt-8 md:text-base">
            {product.description}
          </p>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-6 md:mt-10 md:gap-6 md:pt-8">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted">Price</p>
              <p
                className={`mt-1 font-display text-3xl md:text-4xl ${
                  isRed ? 'text-brand-red-deep' : 'text-brand-blue-deep'
                }`}
              >
                ${product.price}
              </p>
              <p className="mt-1 text-xs text-muted">{product.packSize} feminized seeds</p>
            </div>
            <span
              className={`rounded-full border px-6 py-3 font-display text-[10px] tracking-[0.18em] uppercase md:px-8 md:py-3.5 md:text-xs md:tracking-[0.2em] ${
                isRed
                  ? 'border-brand-red/40 bg-brand-red/10 text-brand-red-deep'
                  : 'border-brand-blue/40 bg-brand-blue/10 text-brand-blue-deep'
              }`}
            >
              Coming Soon
            </span>
          </div>

          {metafields.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-4 md:mt-10 md:gap-x-8 md:gap-y-5">
              {metafields.map((a) => (
                <div key={a.key} className="flex min-w-0 items-start gap-2.5">
                  <MetafieldIcon
                    name={a.icon}
                    fieldKey={a.key}
                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                      isRed ? 'text-brand-red' : 'text-brand-blue'
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                      {a.label}
                    </p>
                    <p className="mt-0.5 text-sm leading-snug text-ink">{a.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16 md:mt-24">
          <h2
            className={`mb-6 font-blackletter text-2xl md:mb-8 md:text-3xl ${
              isRed ? 'text-brand-red-deep' : 'text-brand-blue-deep'
            }`}
          >
            More from the line
          </h2>
          <ProductCarousel products={related} label="strains" />
        </div>
      )}
    </div>
  )
}
