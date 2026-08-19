import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { submitWholesaleApplication } from '../api/commerce'

const empty = {
  company_name: '',
  contact_name: '',
  email: '',
  phone: '',
  website: '',
  license_number: '',
  notes: '',
  password: '',
  password_confirmation: '',
}

export function WholesaleApplyPage() {
  const [form, setForm] = useState(empty)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const onChange =
    (key: keyof typeof empty) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
    }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setError(null)
    try {
      if (form.password !== form.password_confirmation) {
        throw new Error('Passwords do not match')
      }
      await submitWholesaleApplication({
        company_name: form.company_name.trim(),
        contact_name: form.contact_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        website: form.website.trim() || undefined,
        license_number: form.license_number.trim() || undefined,
        notes: form.notes.trim() || undefined,
        password: form.password,
        password_confirmation: form.password_confirmation,
      })
      setStatus('done')
      setForm(empty)
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Could not submit application')
    }
  }

  const fieldClass =
    'mt-1.5 w-full rounded-full border border-line bg-paper px-5 py-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'

  return (
    <div className="min-w-0 overflow-x-hidden bg-paper pb-16 md:pb-24">
      <section className="section-pad mx-auto max-w-2xl pt-24 md:pt-32">
        <p className="font-display text-[10px] tracking-[0.28em] uppercase text-leaf md:text-xs">
          Trade
        </p>
        <h1 className="mt-2 font-blackletter text-4xl leading-tight text-ink md:text-5xl">
          Wholesale application
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
          Apply for a Commonwealth trade account. After approval, staff assign Wholesale or Distro
          pricing. Already approved?{' '}
          <Link to="/wholesale/login" className="text-leaf underline-offset-2 hover:underline">
            Sign in
          </Link>
          .
        </p>

        {status === 'done' ? (
          <div className="mt-10 rounded-2xl border border-leaf/30 bg-paper-soft p-6 md:p-8">
            <p className="font-blackletter text-2xl text-ink">Application received</p>
            <p className="mt-3 text-sm text-muted md:text-base">
              We&apos;ll review your details and follow up when your account is approved. You can
              sign in anytime — tier pricing unlocks after approval.
            </p>
            <Link
              to="/wholesale/login"
              className="mt-6 inline-flex rounded-full bg-brand-red px-6 py-3 font-display text-[10px] tracking-[0.2em] uppercase text-white transition hover:bg-brand-red-deep"
            >
              Go to login
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 space-y-5">
            <label className="block text-sm">
              <span className="font-display text-[10px] tracking-[0.18em] uppercase text-muted">
                Company name *
              </span>
              <input
                required
                value={form.company_name}
                onChange={onChange('company_name')}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm">
              <span className="font-display text-[10px] tracking-[0.18em] uppercase text-muted">
                Contact name *
              </span>
              <input
                required
                value={form.contact_name}
                onChange={onChange('contact_name')}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm">
              <span className="font-display text-[10px] tracking-[0.18em] uppercase text-muted">
                Email *
              </span>
              <input
                required
                type="email"
                value={form.email}
                onChange={onChange('email')}
                className={fieldClass}
              />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-display text-[10px] tracking-[0.18em] uppercase text-muted">
                  Phone
                </span>
                <input value={form.phone} onChange={onChange('phone')} className={fieldClass} />
              </label>
              <label className="block text-sm">
                <span className="font-display text-[10px] tracking-[0.18em] uppercase text-muted">
                  Website
                </span>
                <input value={form.website} onChange={onChange('website')} className={fieldClass} />
              </label>
            </div>
            <label className="block text-sm">
              <span className="font-display text-[10px] tracking-[0.18em] uppercase text-muted">
                License / resale #
              </span>
              <input
                value={form.license_number}
                onChange={onChange('license_number')}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm">
              <span className="font-display text-[10px] tracking-[0.18em] uppercase text-muted">
                Notes
              </span>
              <textarea
                rows={4}
                value={form.notes}
                onChange={onChange('notes')}
                className="mt-1.5 w-full rounded-3xl border border-line bg-paper px-5 py-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-display text-[10px] tracking-[0.18em] uppercase text-muted">
                  Password *
                </span>
                <input
                  required
                  type="password"
                  minLength={8}
                  value={form.password}
                  onChange={onChange('password')}
                  className={fieldClass}
                />
              </label>
              <label className="block text-sm">
                <span className="font-display text-[10px] tracking-[0.18em] uppercase text-muted">
                  Confirm password *
                </span>
                <input
                  required
                  type="password"
                  minLength={8}
                  value={form.password_confirmation}
                  onChange={onChange('password_confirmation')}
                  className={fieldClass}
                />
              </label>
            </div>

            {error && <p className="text-sm text-brand-red">{error}</p>}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex rounded-full bg-brand-red px-7 py-3.5 font-display text-[10px] tracking-[0.2em] uppercase text-white transition hover:bg-brand-red-deep disabled:opacity-70"
            >
              {status === 'submitting' ? 'Submitting…' : 'Submit application'}
            </button>
          </form>
        )}
      </section>
    </div>
  )
}
