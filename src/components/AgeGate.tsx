import { useEffect, useState, type FormEvent } from 'react'

const COOKIE_NAME = 'cw_age_ok'
const SESSION_KEY = 'cw_age_ok'
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 365 days

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`
}

function isAgeVerified(): boolean {
  if (typeof window === 'undefined') return false
  if (readCookie(COOKIE_NAME) === '1') return true
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

function rememberAge(remember: boolean) {
  if (remember) {
    writeCookie(COOKIE_NAME, '1', COOKIE_MAX_AGE)
  } else {
    try {
      window.sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      // sessionStorage unavailable — still dismiss for this view
    }
  }
}

export function AgeGate() {
  const [open, setOpen] = useState(false)
  const [remember, setRemember] = useState(false)

  useEffect(() => {
    setOpen(!isAgeVerified())
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  const onYes = (e: FormEvent) => {
    e.preventDefault()
    rememberAge(remember)
    setOpen(false)
  }

  const onNo = () => {
    window.location.href = 'https://www.google.com/'
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 p-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
    >
      <form
        onSubmit={onYes}
        className="w-full max-w-md border border-line bg-paper p-7 text-center shadow-[0_24px_60px_rgba(0,0,0,0.28)] md:p-9"
      >
        <p className="font-display text-[10px] tracking-[0.28em] uppercase text-leaf">
          Age verification
        </p>
        <h2
          id="age-gate-title"
          className="mt-3 font-blackletter text-3xl leading-tight text-ink md:text-4xl"
        >
          Are you 21 or older?
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          You must be of legal age to enter this site. By continuing, you confirm you are 21+.
        </p>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onNo}
            className="inline-flex justify-center rounded-full border border-line px-7 py-3.5 font-display text-[10px] tracking-[0.2em] uppercase text-ink transition hover:border-ink/40"
          >
            No
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-full bg-leaf px-7 py-3.5 font-display text-[10px] tracking-[0.2em] uppercase text-white transition hover:bg-leaf-deep"
          >
            Yes, I am 21+
          </button>
        </div>

        <label className="mt-6 inline-flex cursor-pointer items-center gap-2.5 text-sm text-ink/80">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 accent-[var(--color-leaf,#288848)]"
          />
          Remember me
        </label>
      </form>
    </div>
  )
}
