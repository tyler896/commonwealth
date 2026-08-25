import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

const fieldClass =
  'mt-1.5 w-full rounded-full border border-line bg-paper px-5 py-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'

export function AccountLoginPage() {
  const { login, user, ready } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from || '/account'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  if (ready && user) {
    return <Navigate to="/account" replace />
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setError(null)
    try {
      await login(email.trim(), password)
      setStatus('idle')
      navigate(from.startsWith('/account') ? from : '/account', { replace: true })
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className="section-pad mx-auto max-w-lg pb-16 pt-24 md:pb-24 md:pt-32">
      <p className="font-display text-[10px] tracking-[0.28em] uppercase text-leaf md:text-xs">
        Account
      </p>
      <h1 className="mt-2 font-blackletter text-4xl text-ink md:text-5xl">Sign in</h1>
      <p className="mt-4 text-sm text-muted md:text-base">
        One account for retail and wholesale. Need trade pricing?{' '}
        <Link to="/wholesale" className="text-leaf underline-offset-2 hover:underline">
          Apply for wholesale
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
            autoComplete="email"
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
            autoComplete="current-password"
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

      <p className="mt-8 text-sm text-muted">
        New here?{' '}
        <Link to="/account/register" className="text-leaf underline-offset-2 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}
