import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useCart } from '../cart/CartContext'
import { useWholesaleMinimum } from '../auth/useWholesaleMinimum'

export function CheckoutPage() {
  const { lines, subtotal, clearCart, count } = useCart()
  const { isB2B, tierLabel, minimum, meetsMinimum, remaining } = useWholesaleMinimum()
  const [done, setDone] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const canCheckout = meetsMinimum(subtotal)

  if (count === 0 && !done) {
    return <Navigate to="/shop" replace />
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!canCheckout) return
    clearCart()
    setDone(true)
  }

  if (done) {
    return (
      <div className="section-pad mx-auto max-w-xl pb-24 pt-36 text-center">
        <img src="/images/logo-green.png" alt="" className="mx-auto mb-8 h-24 w-auto" />
        <h1 className="font-blackletter text-4xl text-leaf md:text-5xl">Order received</h1>
        <p className="mt-4 text-muted">
          Thanks — we&apos;ll confirm your Commonwealth Seed Co order by email shortly.
        </p>
        <Link
          to="/shop"
          className="mt-10 inline-flex rounded-full bg-leaf px-7 py-3.5 font-display text-xs tracking-[0.2em] uppercase text-white"
        >
          Back to shop
        </Link>
      </div>
    )
  }

  return (
    <div className="section-pad mx-auto max-w-5xl pb-24 pt-28 md:pt-36">
      <h1 className="font-blackletter text-4xl text-leaf md:text-5xl">Checkout</h1>
      <p className="mt-2 text-sm text-muted">Commonwealth Seed Co · Wild Thornberry Line only</p>

      {isB2B && minimum > 0 && !canCheckout && (
        <p className="mt-6 rounded-2xl border border-brand-red/30 bg-brand-red/5 px-5 py-4 text-sm text-brand-red">
          {tierLabel} accounts require a ${minimum} minimum. Add ${remaining(subtotal)} more to
          place this order.
        </p>
      )}

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-wider text-muted">
              Full name
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-leaf"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-wider text-muted">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-leaf"
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="mb-2 block text-xs uppercase tracking-wider text-muted"
            >
              Shipping address
            </label>
            <textarea
              id="address"
              required
              rows={4}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full resize-none rounded-lg border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-leaf"
            />
          </div>
          <p className="text-xs text-muted">
            21+ only. You confirm compliance with local seed laws. Payment instructions follow by
            email.
          </p>
          <button
            type="submit"
            disabled={!canCheckout}
            className="w-full rounded-full bg-leaf py-3.5 font-display text-xs tracking-[0.2em] uppercase text-white transition hover:bg-leaf-deep disabled:cursor-not-allowed disabled:bg-ink/20 disabled:text-ink/50"
          >
            Place order · ${subtotal}
          </button>
        </form>

        <div className="border border-line bg-paper-soft p-6">
          <h2 className="font-display text-sm tracking-[0.2em] uppercase text-muted">
            Order summary
          </h2>
          <ul className="mt-6 space-y-4">
            {lines.map(({ product, quantity, lineTotal }) => (
              <li key={product.id} className="flex justify-between gap-4 border-b border-line pb-4">
                <div>
                  <p className="font-blackletter text-lg text-leaf">{product.name}</p>
                  <p className="text-xs text-muted">
                    Qty {quantity} · {product.packSize}
                  </p>
                </div>
                <p className="text-sm text-ink">${lineTotal}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between">
            <span className="text-muted">Subtotal</span>
            <span className="font-display text-xl text-leaf">${subtotal}</span>
          </div>
          {isB2B && minimum > 0 && (
            <p className="mt-3 text-sm text-muted">
              {tierLabel} minimum: ${minimum}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
