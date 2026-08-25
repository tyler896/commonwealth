import { Link } from 'react-router-dom'
import type { Product } from '../data/products'

export function ProductCard({
  product,
  compact = false,
}: {
  product: Product
  compact?: boolean
}) {
  const isRed = product.line === 'grape-sunshine'
  const theme = isRed
    ? {
        border: 'border-brand-red/25 hover:border-brand-red/55',
        title: 'text-brand-red-deep group-hover:text-brand-red',
        badge: 'border-brand-red/30 bg-brand-red/10 text-brand-red-deep',
      }
    : {
        border: 'border-brand-blue/25 hover:border-brand-blue/55',
        title: 'text-brand-blue-deep group-hover:text-brand-blue',
        badge: 'border-brand-blue/30 bg-brand-blue/10 text-brand-blue-deep',
      }

  return (
    <article
      className={`group flex h-full flex-col border bg-paper transition ${theme.border} ${
        compact ? 'p-3 sm:p-4' : 'p-4 md:p-5'
      }`}
    >
      <Link to={`/shop/${product.id}`} className="block min-w-0">
        <div
          className={`relative mb-3 flex aspect-square items-center justify-center overflow-hidden bg-paper-soft md:mb-5 ${
            compact ? '' : ''
          }`}
        >
          <img
            src="/images/logo-circle.png"
            alt=""
            className="h-[78%] w-[78%] object-contain transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <h3
          className={`font-blackletter transition ${theme.title} ${
            compact
              ? 'line-clamp-2 text-xl leading-tight'
              : 'line-clamp-3 text-xl leading-tight md:text-2xl'
          }`}
        >
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/70 md:text-xs">
          {product.lineage}
        </p>
      </Link>

      <div className="mt-auto flex items-center justify-between gap-2 pt-4 md:gap-3 md:pt-5">
        <p className="font-display text-base text-ink md:text-lg">
          ${product.price}
          <span className="ml-1.5 text-[10px] text-muted md:ml-2 md:text-xs">{product.packSize}</span>
        </p>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-1.5 font-display text-[9px] tracking-[0.14em] uppercase md:px-4 md:py-2 md:text-[10px] md:tracking-[0.18em] ${theme.badge}`}
        >
          Coming Soon
        </span>
      </div>
    </article>
  )
}
