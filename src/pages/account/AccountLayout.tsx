import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const tabs = [
  { to: '/account', label: 'Overview', end: true },
  { to: '/account/orders', label: 'Orders' },
  { to: '/account/addresses', label: 'Addresses' },
  { to: '/account/wishlist', label: 'Wishlist' },
]

export function AccountLayout() {
  const { user, tierLabel, logout } = useAuth()

  return (
    <div className="section-pad mx-auto max-w-5xl pb-16 pt-24 md:pb-24 md:pt-32">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-[10px] tracking-[0.28em] uppercase text-leaf md:text-xs">
            Account
          </p>
          <h1 className="mt-2 font-blackletter text-4xl text-ink md:text-5xl">Your account</h1>
          <p className="mt-3 text-sm text-muted md:text-base">
            {user?.full_name || user?.email}
            {tierLabel ? (
              <>
                {' '}
                · <span className="text-ink">{tierLabel}</span>
              </>
            ) : null}
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="font-display text-[10px] tracking-[0.18em] uppercase text-ink/50 transition hover:text-ink"
        >
          Sign out
        </button>
      </div>

      <nav className="mt-10 flex flex-wrap gap-2 border-b border-line pb-px">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `font-display text-[10px] tracking-[0.16em] uppercase transition md:text-xs ${
                isActive
                  ? '-mb-px border-b-2 border-ink pb-3 text-ink'
                  : 'pb-3 text-ink/45 hover:text-ink'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-10">
        <Outlet />
      </div>
    </div>
  )
}
