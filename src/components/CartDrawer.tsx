import { Link } from 'react-router-dom'
import { useCart } from '../cart/CartContext'
import { useWholesaleMinimum } from '../auth/useWholesaleMinimum'

export function CartDrawer() {
  const { isOpen, closeCart, lines, subtotal, setQuantity, removeItem, count } = useCart()
  const { isB2B, tierLabel, minimum, meetsMinimum, remaining } = useWholesaleMinimum()
  const canCheckout = meetsMinimum(subtotal)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close cart"
        onClick={closeCart}
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-line bg-paper shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-lg tracking-tight text-ink">
            Your bag <span className="text-leaf">({count})</span>
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="font-display text-xs tracking-[0.2em] uppercase text-muted hover:text-leaf"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {lines.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted">No seeds in the bag yet.</p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-6 font-display text-xs tracking-[0.2em] uppercase text-leaf"
              >
                Keep shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {lines.map(({ product, quantity, lineTotal }) => (
                <li key={product.id} className="border-b border-line pb-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-blackletter text-xl text-leaf">{product.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-wide text-muted">
                        {product.lineage}
                      </p>
                      <p className="mt-1 text-sm text-ink/70">{product.packSize} · Feminized</p>
                    </div>
                    <p className="font-display text-sm text-ink">${lineTotal}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 border border-line px-3 py-1.5">
                      <button
                        type="button"
                        className="text-ink hover:text-leaf"
                        onClick={() => setQuantity(product.id, quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="min-w-6 text-center text-sm">{quantity}</span>
                      <button
                        type="button"
                        className="text-ink hover:text-leaf"
                        onClick={() => setQuantity(product.id, quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="text-xs uppercase tracking-wider text-muted hover:text-leaf"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-line px-6 py-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-muted">Subtotal</span>
              <span className="font-display text-xl text-leaf">${subtotal}</span>
            </div>
            {isB2B && minimum > 0 && (
              <p className={`mb-4 text-sm ${canCheckout ? 'text-muted' : 'text-brand-red'}`}>
                {tierLabel} minimum order: ${minimum}
                {!canCheckout && <> · add ${remaining(subtotal)} more</>}
              </p>
            )}
            {canCheckout ? (
              <Link
                to="/checkout"
                onClick={closeCart}
                className="flex w-full items-center justify-center rounded-full bg-leaf py-3.5 font-display text-xs tracking-[0.2em] uppercase text-white transition hover:bg-leaf-deep"
              >
                Checkout
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="flex w-full cursor-not-allowed items-center justify-center rounded-full bg-ink/20 py-3.5 font-display text-xs tracking-[0.2em] uppercase text-ink/50"
              >
                Minimum not met
              </button>
            )}
          </div>
        )}
      </aside>
    </div>
  )
}
