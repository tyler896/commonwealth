import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../cart/CartContext'
import { collections } from '../data/products'

const links = [
  { to: '/', label: 'Home', accent: 'ink' as const, end: true },
  { to: '/shop', label: 'Shop', accent: 'ink' as const, end: true },
  ...collections.map((c) => ({
    to: `/collections/${c.slug}`,
    label: c.id === 'wild-thornberry' ? 'Wild Thornberry' : 'Grape Sunshine',
    accent: (c.accent === 'red' ? 'red' : 'purple') as 'red' | 'purple',
    end: false,
  })),
]

function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="20" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1.5" fill="currentColor" stroke="none" />
      <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 8H6.4" />
    </svg>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { count, openCart } = useCart()
  const { pathname } = useLocation()

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

  const linkClass = (to: string, accent: 'ink' | 'red' | 'purple', isActive: boolean) => {
    const active =
      accent === 'red' ? 'text-brand-red' : accent === 'purple' ? 'text-raven' : 'text-ink'
    // Force exact match for Home — RR can treat "/" as a prefix of every path.
    const on =
      to === '/' ? pathname === '/' || pathname === '' : isActive
    return `font-display text-xs tracking-[0.16em] uppercase transition-colors lg:text-sm lg:tracking-[0.18em] ${
      on ? active : 'text-ink/65 hover:text-ink'
    }`
  }

  const mobileLinkClass = (to: string, accent: 'ink' | 'red' | 'purple', isActive: boolean) => {
    const active =
      accent === 'red' ? 'text-brand-red' : accent === 'purple' ? 'text-raven' : 'text-ink'
    const on = to === '/' ? pathname === '/' || pathname === '' : isActive
    return `border-b border-line py-4 font-display text-2xl tracking-tight transition ${
      on ? active : 'text-ink'
    }`
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-line pt-[env(safe-area-inset-top)] transition-all duration-300 ${
        scrolled || open ? 'bg-paper/95 backdrop-blur-md' : 'bg-paper'
      }`}
    >
      <div className="section-pad mx-auto flex h-14 max-w-7xl items-center justify-between md:h-20">
        <Link
          to="/"
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
              end={link.end}
              className={({ isActive }) => linkClass(link.to, link.accent, isActive)}
            >
              {link.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={openCart}
            aria-label={count > 0 ? `Open cart, ${count} items` : 'Open cart'}
            className="relative flex items-center justify-center rounded-full bg-brand-red px-4 py-2 text-white transition hover:bg-brand-red-deep"
          >
            <CartIcon className="h-4 w-4" />
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
            aria-label={count > 0 ? `Open cart, ${count} items` : 'Open cart'}
            className="relative flex items-center justify-center rounded-full bg-brand-red px-3 py-1.5 text-white"
          >
            <CartIcon className="h-3.5 w-3.5" />
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
                end={link.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) => mobileLinkClass(link.to, link.accent, isActive)}
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
