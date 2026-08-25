import { useState, type FormEvent } from 'react'
import { subscribeNewsletter } from '../api/commerce'

const WEBHOOK_URL = 'https://hook.us2.make.com/owttttrlhd2b8aj898d5gf9qaha59xe1'

type Props = {
  id?: string
  className?: string
  inputClassName?: string
  buttonClassName?: string
  /** Button label when idle */
  buttonLabel?: string
  successClassName?: string
  errorClassName?: string
}

async function notifyMake(email: string) {
  try {
    const formData = new FormData()
    formData.append('email', email)
    await fetch(WEBHOOK_URL, { method: 'POST', body: formData })
  } catch {
    // Make is best-effort; commerce newsletter is the source of truth for admin
  }
}

export function NewsletterSignup({
  id = 'newsletter-email',
  className = '',
  inputClassName = '',
  buttonClassName = '',
  buttonLabel = 'Notify Me',
  successClassName = 'text-sm text-gold',
  errorClassName = 'basis-full text-sm text-brand-red',
}: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle')

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || status === 'submitting') return

    const value = email.trim()
    setStatus('submitting')
    try {
      await subscribeNewsletter(value)
      void notifyMake(value)
      setEmail('')
      setStatus('ok')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'ok') {
    return <p className={successClassName}>You&apos;re on the list. Welcome to the flock.</p>
  }

  return (
    <form onSubmit={onSubmit} className={className}>
      <label className="sr-only" htmlFor={id}>
        Email
      </label>
      <input
        id={id}
        type="email"
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          if (status === 'error') setStatus('idle')
        }}
        placeholder="your@email.com"
        className={inputClassName}
      />
      <button type="submit" disabled={status === 'submitting'} className={buttonClassName}>
        {status === 'submitting' ? 'Saving…' : buttonLabel}
      </button>
      {status === 'error' && (
        <p className={errorClassName}>Something went wrong — try again.</p>
      )}
    </form>
  )
}
