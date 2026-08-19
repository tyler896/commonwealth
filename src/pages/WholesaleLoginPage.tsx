import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function WholesaleLoginPage() {
  const { login, user, logout, tierLabel, isB2B } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setError(null)
    try {
      await login(email.trim(), password)
      setStatus('idle')
      navigate('/shop')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  const fieldClass =
    'mt-1.5 w-full rounded-full border border-line bg-paper px-5 py-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'

  if (user) {
    return (
      <div className="section-pad mx-auto max-w-lg pb-16 pt-24 md:pb-24 md:pt-32">
        <p className="font-display text-[10px] tracking-[0.28em] uppercase text-leaf md:text-xs">
          Trade account
        </p>
        <h1 className="mt-2 font-blackletter text-4xl text-ink md:text-5xl">Signed in</h1>
        <p className="mt-4 text-sm text-muted md:text-base">
          {user.email}
          {tierLabel ? (
            <>
              {' '}
              · <span className="text-ink">{tierLabel}</span> pricing
            </>
          ) : (
            <> · pending approval (retail pricing until approved)</>
          )}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/shop"
            className="inline-flex rounded-full bg-brand-red px-6 py-3 font-display text-[10px] tracking-[0.2em] uppercase text-white transition hover:bg-brand-red-deep"
          >
            {isB2B ? 'Shop with tier pricing' : 'Browse shop'}
          </Link>
          <button
            type="button"
            onClick={logout}
            className="inline-flex rounded-full border border-line px-6 py-3 font-display text-[10px] tracking-[0.2em] uppercase text-ink transition hover:border-ink/40"
          >
            Sign out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="section-pad mx-auto max-w-lg pb-16 pt-24 md:pb-24 md:pt-32">
      <p className="font-display text-[10px] tracking-[0.28em] uppercase text-leaf md:text-xs">
        Trade
      </p>
      <h1 className="mt-2 font-blackletter text-4xl text-ink md:text-5xl">Wholesale login</h1>
      <p className="mt-4 text-sm text-muted md:text-base">
        Sign in to see your Wholesale or Distro prices.{' '}
        <Link to="/wholesale" className="text-leaf underline-offset-2 hover:underline">
          Apply for an account
        </Link>
        .
      </p>

      <form onSubmit={onSubmit} className="mt-10 space-y-5">
        <label className="block text-sm">
          <span className="font-display text-[10px] tracking-[0.18em] uppercase text-muted">
            Email
          </span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm">
          <span className="font-display text-[10px] tracking-[0.18em] uppercase text-muted">
            Password
          </span>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
          />
        </label>
        {error && <p className="text-sm text-brand-red">{error}</p>}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex rounded-full bg-brand-red px-7 py-3.5 font-display text-[10px] tracking-[0.2em] uppercase text-white transition hover:bg-brand-red-deep disabled:opacity-70"
        >
          {status === 'submitting' ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
