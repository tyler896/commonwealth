import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

const fieldClass =
  'mt-1.5 w-full rounded-full border border-line bg-paper px-5 py-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'

export function AccountRegisterPage() {
  const { register, user, ready } = useAuth()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  if (ready && user) {
    return <Navigate to="/account" replace />
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match')
      setStatus('error')
      return
    }
    setStatus('submitting')
    setError(null)
    try {
      await register({
        email: email.trim(),
        password,
        password_confirmation: confirm,
        first_name: firstName.trim() || undefined,
        last_name: lastName.trim() || undefined,
      })
      setStatus('idle')
      navigate('/account', { replace: true })
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Registration failed')
    }
  }

  return (
    <div className="section-pad mx-auto max-w-lg pb-16 pt-24 md:pb-24 md:pt-32">
      <p className="font-display text-[10px] tracking-[0.28em] uppercase text-leaf md:text-xs">
        Account
      </p>
      <h1 className="mt-2 font-blackletter text-4xl text-ink md:text-5xl">Create account</h1>
      <p className="mt-4 text-sm text-muted md:text-base">
        Save addresses, track orders, and keep a wishlist. Trade accounts use the same login after
        approval.
      </p>

      <form onSubmit={onSubmit} className="mt-10 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-display text-[10px] tracking-[0.18em] uppercase text-muted">
              First name
            </span>
            <input
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm">
            <span className="font-display text-[10px] tracking-[0.18em] uppercase text-muted">
              Last name
            </span>
            <input
              type="text"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={fieldClass}
            />
          </label>
        </div>
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
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm">
          <span className="font-display text-[10px] tracking-[0.18em] uppercase text-muted">
            Confirm password
          </span>
          <input
            required
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={fieldClass}
          />
        </label>
        {error && <p className="text-sm text-brand-red">{error}</p>}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex rounded-full bg-brand-red px-7 py-3.5 font-display text-[10px] tracking-[0.2em] uppercase text-white transition hover:bg-brand-red-deep disabled:opacity-70"
        >
          {status === 'submitting' ? 'Creating…' : 'Create account'}
        </button>
      </form>

      <p className="mt-8 text-sm text-muted">
        Already have an account?{' '}
        <Link to="/account/login" className="text-leaf underline-offset-2 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
