import { Link, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useCart } from '../cart/CartContext'
import { collections } from '../data/products'

const links = [
  { to: '/shop', label: 'Home', accent: 'ink' as const },
  ...collections.map((c) => ({
    to: `/collections/${c.slug}`,
    label: c.id === 'wild-thornberry' ? 'Wild Thornberry' : 'Grape Sunshine',
    accent: c.accent === 'red' ? ('red' as const) : ('purple' as const),
  })),
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { count, openCart } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-line pt-[env(safe-area-inset-top)] transition-all duration-300 ${
        scrolled || open ? 'bg-paper/95 backdrop-blur-md' : 'bg-paper'
      }`}
    >
      <div className="section-pad mx-auto flex h-14 max-w-7xl items-center justify-between md:h-20">
        <Link
          to="/shop"
          className="relative z-10 flex min-w-0 items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <img
            src="/images/logo-header.png"
            alt="Commonwealth Seed Co"
            className="h-9 w-auto md:h-12"
          />
          <span className="sr-only">Commonwealth Seed Co</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:gap-8 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/shop'}
              className={({ isActive }) => {
                const active =
                  link.accent === 'red'
                    ? 'text-brand-red'
                    : link.accent === 'purple'
                      ? 'text-raven'
                      : 'text-ink'
                return `font-display text-xs tracking-[0.16em] uppercase transition-colors lg:text-sm lg:tracking-[0.18em] ${
                  isActive ? active : 'text-ink/65 hover:text-ink'
                }`
              }}
            >
              {link.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={openCart}
            className="relative rounded-full bg-brand-red px-5 py-2 font-display text-xs tracking-[0.2em] uppercase text-white transition hover:bg-brand-red-deep"
          >
            Bag
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </button>
        </nav>

        <div className="relative z-10 flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={openCart}
            className="relative rounded-full bg-brand-red px-3.5 py-1.5 font-display text-[10px] tracking-[0.18em] uppercase text-white"
          >
            Bag
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[9px] font-bold text-white">
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <div className="flex w-5 flex-col gap-1.5">
              <span
                className={`h-0.5 w-full bg-ink transition ${open ? 'translate-y-2 rotate-45' : ''}`}
              />
              <span className={`h-0.5 w-full bg-ink transition ${open ? 'opacity-0' : ''}`} />
              <span
                className={`h-0.5 w-full bg-ink transition ${open ? '-translate-y-2 -rotate-45' : ''}`}
              />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 top-[calc(3.5rem+env(safe-area-inset-top))] z-40 overflow-y-auto bg-paper px-6 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/shop'}
                onClick={() => setOpen(false)}
                className={({ isActive }) => {
                  const active =
                    link.accent === 'red'
                      ? 'text-brand-red'
                      : link.accent === 'purple'
                        ? 'text-raven'
                        : 'text-ink'
                  return `border-b border-line py-4 font-display text-2xl tracking-tight transition ${
                    isActive ? active : 'text-ink'
                  }`
                }}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
