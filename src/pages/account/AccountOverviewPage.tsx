import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

export function AccountOverviewPage() {
  const { user, tierLabel, isB2B } = useAuth()

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-display text-sm tracking-[0.12em] uppercase text-ink">Profile</h2>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-display text-[10px] tracking-[0.16em] uppercase text-muted">
              Name
            </dt>
            <dd className="mt-1 text-ink">
              {user?.full_name || [user?.first_name, user?.last_name].filter(Boolean).join(' ') || '—'}
            </dd>
          </div>
          <div>
            <dt className="font-display text-[10px] tracking-[0.16em] uppercase text-muted">
              Email
            </dt>
            <dd className="mt-1 text-ink">{user?.email}</dd>
          </div>
          <div>
            <dt className="font-display text-[10px] tracking-[0.16em] uppercase text-muted">
              Pricing
            </dt>
            <dd className="mt-1 text-ink">{tierLabel || 'Retail'}</dd>
          </div>
        </dl>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { to: '/account/orders', label: 'Orders', blurb: 'View past purchases' },
          { to: '/account/addresses', label: 'Addresses', blurb: 'Saved shipping details' },
          { to: '/account/wishlist', label: 'Wishlist', blurb: 'Strains you’ve saved' },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="border border-line bg-paper-soft/40 p-5 transition hover:border-ink/30"
          >
            <p className="font-display text-[10px] tracking-[0.16em] uppercase text-ink">
              {item.label}
            </p>
            <p className="mt-2 text-sm text-muted">{item.blurb}</p>
          </Link>
        ))}
      </section>

      {!isB2B && (
        <p className="text-sm text-muted">
          Looking for wholesale or distro pricing?{' '}
          <Link to="/wholesale" className="text-leaf underline-offset-2 hover:underline">
            Apply here
          </Link>
          .
        </p>
      )}
    </div>
  )
}
