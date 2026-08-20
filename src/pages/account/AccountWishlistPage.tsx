import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ensureDefaultWishlist,
  removeWishlistItem,
  type Wishlist,
  type WishlistItem,
} from '../../api/commerce'

export function AccountWishlistPage() {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    const list = await ensureDefaultWishlist()
    setWishlist(list)
  }

  useEffect(() => {
    let alive = true
    setLoading(true)
    ensureDefaultWishlist()
      .then((list) => {
        if (alive) setWishlist(list)
      })
      .catch((err) => {
        if (alive) setError(err instanceof Error ? err.message : 'Could not load wishlist')
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  const onRemove = async (item: WishlistItem) => {
    if (!wishlist) return
    setError(null)
    try {
      await removeWishlistItem(wishlist.id, item.id)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not remove item')
    }
  }

  if (loading) {
    return <p className="text-sm text-muted">Loading wishlist…</p>
  }

  if (error && !wishlist) {
    return <p className="text-sm text-brand-red">{error}</p>
  }

  const items = wishlist?.items || []

  if (!items.length) {
    return (
      <div>
        {error && <p className="mb-4 text-sm text-brand-red">{error}</p>}
        <p className="text-sm text-muted">Your wishlist is empty.</p>
        <Link
          to="/shop"
          className="mt-6 inline-flex rounded-full bg-brand-red px-6 py-3 font-display text-[10px] tracking-[0.2em] uppercase text-white transition hover:bg-brand-red-deep"
        >
          Browse shop
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-brand-red">{error}</p>}
      <ul className="divide-y divide-line border-y border-line">
        {items.map((item) => {
          const name =
            item.variant?.product?.name ||
            item.variant?.sku ||
            item.variant?.options_text ||
            `Variant ${item.variant_id}`
          const slug = item.variant?.product?.slug
          return (
            <li key={item.id} className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0">
                {slug ? (
                  <Link to={`/shop/${slug}`} className="font-medium text-ink hover:text-leaf">
                    {name}
                  </Link>
                ) : (
                  <p className="font-medium text-ink">{name}</p>
                )}
                {item.variant?.options_text && (
                  <p className="mt-1 text-xs text-muted">{item.variant.options_text}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onRemove(item)}
                className="shrink-0 font-display text-[10px] tracking-[0.16em] uppercase text-ink/45 transition hover:text-brand-red"
              >
                Remove
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
