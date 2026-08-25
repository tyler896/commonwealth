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

    const reset = () => {
      el.scrollLeft = 0
      update()
    }

    reset()
    // Snap can run after paint and eat the left inset — re-assert start.
    const t0 = requestAnimationFrame(() => {
      reset()
      requestAnimationFrame(reset)
    })

    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(t0)
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [products.length])

  const scrollByCard = (dir: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-carousel-card]')
    const amount = card ? card.offsetWidth + 12 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  const goTo = (i: number) => {
    const el = scrollerRef.current
    if (!el) return
    const card = el.querySelectorAll<HTMLElement>('[data-carousel-card]')[i]
    if (!card) return
    card.scrollIntoView({ inline: 'start', block: 'nearest', behavior: 'smooth' })
  }

  if (!products.length) return null

  return (
    <div className="relative min-w-0">
      <div className="section-pad mb-3 flex items-center justify-between gap-3 md:hidden">
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
        className="product-carousel flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-3 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:snap-none md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 lg:grid-cols-3 xl:grid-cols-4 [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <div
            key={product.catalogId}
            data-carousel-card
            className="w-[78vw] max-w-[22rem] shrink-0 snap-start md:w-auto md:max-w-none"
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
