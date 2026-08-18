import { useState, type FormEvent } from 'react'

const WEBHOOK_URL = 'https://hook.us2.make.com/owttttrlhd2b8aj898d5gf9qaha59xe1'

type Props = {
  id?: string
  className?: string
  inputClassName?: string
  buttonClassName?: string
}

export function NewsletterSignup({
  id = 'newsletter-email',
  className = '',
  inputClassName = '',
  buttonClassName = '',
}: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle')

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || status === 'submitting') return

    setStatus('submitting')
    try {
      const formData = new FormData()
      formData.append('email', email.trim())
      const response = await fetch(WEBHOOK_URL, { method: 'POST', body: formData })
      if (!response.ok) throw new Error('Submission failed')
      setEmail('')
      setStatus('ok')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'ok') {
    return <p className="text-sm text-gold">You&apos;re on the list. Welcome to the flock.</p>
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
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className={inputClassName}
      />
      <button type="submit" disabled={status === 'submitting'} className={buttonClassName}>
        {status === 'submitting' ? 'Sending…' : 'Notify Me'}
      </button>
      {status === 'error' && (
        <p className="basis-full text-sm text-brand-red">Something went wrong — try again.</p>
      )}
    </form>
  )
}
