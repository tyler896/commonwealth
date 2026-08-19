import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchEvents, fetchProducts } from '../api/commerce'
import type { Product } from '../data/products'
import type { StoreEvent } from '../api/commerce'
import { ProductCarousel } from '../components/ProductCarousel'
import { EventsHomeWidget } from '../components/EventsHomeWidget'

const TRUST = [
  { label: 'Feminized genetics', detail: 'Stable crosses for the garden' },
  { label: 'Oregon-bred', detail: 'Selected and worked in-house' },
  { label: 'Two lines', detail: 'Wild Thornberry & Grape Sunshine' },
] as const

export function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [loadingFeatured, setLoadingFeatured] = useState(true)
  const [events, setEvents] = useState<StoreEvent[]>([])

  useEffect(() => {
    let alive = true
    fetchProducts()
      .then((items) => {
        if (!alive) return
        const picks = items.filter((p) => p.featured)
        setFeatured((picks.length ? picks : items).slice(0, 8))
      })
      .catch(() => {
        if (alive) setFeatured([])
      })
      .finally(() => {
        if (alive) setLoadingFeatured(false)
      })
    fetchEvents(3).then((items) => {
      if (alive) setEvents(items)
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="min-w-0 overflow-x-hidden bg-paper">
      {/* Hero */}
      <section className="relative isolate h-[80vh] max-h-[80vh] overflow-hidden bg-[#2a8a4a]">
        <div className="section-pad relative z-10 mx-auto flex h-full min-w-0 max-w-7xl flex-col justify-center pb-10 pt-24 md:pb-16 md:pt-28">
          <div className="min-w-0 max-w-xl">
            <h1 className="font-blackletter text-[1.75rem] leading-[1.1] tracking-tight text-[#f4ecd8] animate-rise break-words hyphens-none sm:text-5xl md:text-6xl lg:text-7xl">
              Seeds for the People
            </h1>
            <p
              className="mt-3 w-full max-w-full text-sm leading-relaxed text-[#f4ecd8]/85 animate-rise break-words md:mt-5 md:max-w-md md:text-base"
              style={{ animationDelay: '80ms' }}
            >
              Feminized Commonwealth genetics.
              <br className="sm:hidden" />{' '}
              Two lines, built for the garden.
            </p>
            <div
              className="mt-6 flex w-full max-w-full flex-col items-start gap-3 animate-rise sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 md:mt-10 md:gap-6"
              style={{ animationDelay: '160ms' }}
            >
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-full bg-brand-red px-7 py-3.5 font-display text-[10px] tracking-[0.2em] uppercase !text-white transition hover:bg-brand-red-deep md:px-8 md:text-xs"
              >
                Shop the lines
              </Link>
              <a
                href="#featured"
                className="font-display text-[10px] tracking-[0.2em] uppercase text-white transition hover:text-white/80 md:text-xs"
              >
                Featured strains
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured strains */}
      <section id="featured" className="overflow-x-clip py-16 md:py-24">
        <div className="section-pad mx-auto max-w-7xl">
          <p className="font-display text-[10px] tracking-[0.28em] uppercase text-muted md:text-xs">
            Featured
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-blackletter text-3xl text-ink md:text-4xl lg:text-5xl">
              Strains in the nest
            </h2>
            <Link
              to="/shop"
              className="font-display text-[10px] tracking-[0.2em] uppercase text-ink/55 transition hover:text-leaf md:text-xs"
            >
              View all →
            </Link>
          </div>

          {loadingFeatured && (
            <p className="mt-10 text-center font-display text-sm tracking-[0.2em] uppercase text-muted">
              Loading strains…
            </p>
          )}

          {!loadingFeatured && featured.length === 0 && (
            <p className="mt-10 text-sm text-muted">
              Catalog is warming up.{' '}
              <Link to="/shop" className="text-leaf underline-offset-2 hover:underline">
                Browse the shop
              </Link>
              .
            </p>
          )}
        </div>

        {!loadingFeatured && featured.length > 0 && (
          <div className="section-pad-md mx-auto mt-8 max-w-7xl md:mt-12">
            <ProductCarousel products={featured} label="Featured strains" />
          </div>
        )}
      </section>

      <EventsHomeWidget events={events} />

      {/* Brand story teaser */}
      <section className="border-y border-line bg-paper-soft">
        <div className="section-pad mx-auto grid max-w-7xl items-center gap-10 py-16 md:grid-cols-2 md:gap-16 md:py-24">
          <div className="relative mx-auto aspect-square w-full max-w-sm animate-fade md:max-w-md">
            <img
              src="/images/logo-circle.png"
              alt=""
              className="h-full w-full object-contain drop-shadow-[0_18px_36px_rgba(0,0,0,0.12)]"
            />
          </div>
          <div className="animate-rise">
            <p className="font-display text-[10px] tracking-[0.28em] uppercase text-leaf md:text-xs">
              Our story
            </p>
            <h2 className="mt-2 font-blackletter text-3xl leading-tight text-ink md:text-4xl lg:text-[2.75rem]">
              Genetics for the commons
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted md:mt-5 md:text-base">
              Commonwealth Seed Co works feminized lines meant to be shared — selected crosses,
              clear lineage, and packs ready for growers who want something real in the soil.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-block font-display text-[10px] tracking-[0.2em] uppercase text-leaf transition hover:text-leaf-deep md:mt-8 md:text-xs"
            >
              Explore the catalog →
            </Link>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="section-pad mx-auto max-w-7xl py-14 md:py-20">
        <p className="text-center font-display text-[10px] tracking-[0.28em] uppercase text-muted md:text-xs">
          Why Commonwealth
        </p>
        <ul className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-10 md:mt-10">
          {TRUST.map((item) => (
            <li key={item.label} className="text-center">
              <p className="font-blackletter text-xl text-ink md:text-2xl">{item.label}</p>
              <p className="mt-2 text-sm text-muted">{item.detail}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
