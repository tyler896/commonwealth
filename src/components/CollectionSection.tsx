import { Link } from 'react-router-dom'
import type { Collection, Product } from '../data/products'
import { ProductCarousel } from './ProductCarousel'

export function CollectionSection({
  collection,
  products,
}: {
  collection: Collection
  products: Product[]
}) {
  const accent =
    collection.accent === 'red'
      ? {
          label: 'text-brand-red',
          btn: 'text-brand-red hover:text-brand-red-deep',
        }
      : {
          label: 'text-raven',
          btn: 'text-raven hover:text-raven-deep',
        }

  return (
    <section className="overflow-x-clip py-10 md:py-16">
      <div className="section-pad mx-auto mb-6 flex max-w-7xl flex-wrap items-end justify-between gap-3 md:mb-10 md:gap-4">
        <div className="min-w-0 flex-1">
          <p className={`font-display text-[10px] tracking-[0.28em] uppercase md:text-xs ${accent.label}`}>
            Collection
          </p>
          <h2 className="mt-1.5 font-blackletter text-2xl leading-tight text-ink sm:text-3xl md:mt-2 md:text-4xl">
            <Link to={`/collections/${collection.slug}`} className="transition hover:opacity-80">
              {collection.name}
            </Link>
          </h2>
          <p className="mt-1.5 line-clamp-2 text-xs text-muted md:mt-2 md:text-sm">
            ({collection.parent})
          </p>
        </div>
        <Link
          to={`/collections/${collection.slug}`}
          className={`shrink-0 font-display text-[10px] tracking-[0.2em] uppercase transition md:text-xs ${accent.btn}`}
        >
          View all →
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="md:section-pad md:mx-auto md:max-w-7xl">
          <ProductCarousel products={products} label="strains" />
        </div>
      ) : (
        <p className="section-pad mx-auto max-w-7xl text-sm text-muted">Products coming soon.</p>
      )}
    </section>
  )
}
