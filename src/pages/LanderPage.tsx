import { useState, type FormEvent } from 'react'
import './LanderPage.css'

const WEBHOOK_URL = 'https://hook.us2.make.com/owttttrlhd2b8aj898d5gf9qaha59xe1'

export function LanderPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle')

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || status === 'submitting') return

    setStatus('submitting')
    try {
      const formData = new FormData()
      formData.append('email', email.trim())

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Submission failed')

      setEmail('')
      setStatus('ok')
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="cw-lander">
      <section className="cw-lander__content">
        <img
          className="cw-lander__logo"
          src="/lander/commonwealth-seeds-share.png"
          alt="Commonwealth Seeds Co"
        />

        <div className="cw-lander__signup">
          <div className="cw-lander__signup-label">Sign up for drop alerts.</div>

          {status === 'ok' ? (
            <div className="cw-lander__success">Thanks! You’re on the list.</div>
          ) : (
            <form className="cw-lander__form" onSubmit={onSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (status === 'error') setStatus('idle')
                }}
              />
              <button type="submit" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Submitting...' : 'Notify Me'}
              </button>
              {status === 'error' && (
                <p className="cw-lander__error">Something went wrong. Please try again.</p>
              )}
            </form>
          )}
        </div>

        <div className="cw-lander__footer">&copy; Common Wealth Seed Co.</div>
      </section>

      <img
        className="cw-lander__side"
        src="/lander/CWsocials-01.png"
        alt="Commonwealth Seeds Co garden visual"
      />
    </main>
  )
}
