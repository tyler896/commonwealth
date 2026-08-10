import { useEffect, useRef, useState } from 'react'
import type { Product } from '../data/products'
import { ProductCard } from './ProductCard'

export function ProductCarousel({
  products,
  label = 'Products',
}: {
  products: Product[]
  label?: string
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const update = () => {
    const el = scrollerRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    setCanPrev(el.scrollLeft > 8)
    setCanNext(el.scrollLeft < maxScroll - 8)

    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-carousel-card]'))
    if (!cards.length) return
    const mid = el.scrollLeft + el.clientWidth / 2
    let closest = 0
    let best = Infinity
    cards.forEach((card, i) => {
      const center = card.offsetLeft + card.offsetWidth / 2
      const dist = Math.abs(center - mid)
      if (dist < best) {
        best = dist
        closest = i
      }
    })
    setIndex(closest)
  }

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [products.length])

  const scrollByCard = (dir: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-carousel-card]')
    const amount = card ? card.offsetWidth + 16 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  const goTo = (i: number) => {
    const el = scrollerRef.current
    if (!el) return
    const card = el.querySelectorAll<HTMLElement>('[data-carousel-card]')[i]
    card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }

  if (!products.length) return null

  return (
    <div className="relative">
      <div className="mb-3 flex items-center justify-between gap-3 px-1 md:hidden">
        <p className="font-display text-[10px] tracking-[0.22em] uppercase text-muted">
          Swipe · {products.length} {label.toLowerCase()}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous products"
            disabled={!canPrev}
            onClick={() => scrollByCard(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper text-ink transition disabled:opacity-30"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next products"
            disabled={!canNext}
            onClick={() => scrollByCard(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper text-ink transition disabled:opacity-30"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="product-carousel -mx-[clamp(1.25rem,4vw,4rem)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(1.25rem,4vw,4rem)] pb-3 pt-1 md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3 xl:grid-cols-4"
      >
        {products.map((product) => (
          <div
            key={product.catalogId}
            data-carousel-card
            className="w-[78vw] max-w-[20rem] shrink-0 snap-center md:w-auto md:max-w-none"
          >
            <ProductCard product={product} compact />
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-1.5 md:hidden">
        {products.map((product, i) => (
          <button
            key={product.catalogId}
            type="button"
            aria-label={`Go to ${product.name}`}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-6 bg-brand-red' : 'w-1.5 bg-ink/20'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
