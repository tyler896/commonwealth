import { useState, type FormEvent } from 'react'
import { NewsletterSignup } from '../components/NewsletterSignup'
import { PREVIEW_PASSWORD, unlockPreview } from '../config'
import { AgeGate } from '../components/AgeGate'
import './LanderPage.css'

export function LanderPage() {
  const [showPreview, setShowPreview] = useState(false)
  const [password, setPassword] = useState('')
  const [previewError, setPreviewError] = useState(false)

  const onPreviewSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (password === PREVIEW_PASSWORD) {
      unlockPreview()
      return
    }
    setPreviewError(true)
  }

  return (
    <main className="cw-lander">
      <AgeGate />
      <section className="cw-lander__content">
        <img
          className="cw-lander__logo"
          src="/lander/commonwealth-seeds-share.png"
          alt="Commonwealth Seeds Co"
        />

        <div className="cw-lander__signup">
          <div className="cw-lander__signup-label">Sign up for drop alerts.</div>
          <NewsletterSignup
            id="lander-newsletter-email"
            className="cw-lander__form"
            buttonLabel="Notify Me"
            successClassName="cw-lander__success"
            errorClassName="cw-lander__error"
          />
        </div>

        <div className="cw-lander__footer">
          <span>&copy; Common Wealth Seed Co.</span>
          <button
            type="button"
            className="cw-lander__preview-toggle"
            onClick={() => {
              setShowPreview((v) => !v)
              setPreviewError(false)
              setPassword('')
            }}
          >
            Preview site
          </button>
        </div>

        {showPreview && (
          <form className="cw-lander__preview" onSubmit={onPreviewSubmit}>
            <input
              type="password"
              name="preview-password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setPreviewError(false)
              }}
              required
            />
            <button type="submit">Enter</button>
            {previewError && <p className="cw-lander__error">Incorrect password.</p>}
          </form>
        )}
      </section>
    </main>
  )
}
