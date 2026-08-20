import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchCustomerOrders, type CustomerOrder } from '../../api/commerce'

function formatDate(iso: string | null) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

export function AccountOrdersPage() {
  const [orders, setOrders] = useState<CustomerOrder[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    fetchCustomerOrders()
      .then((data) => {
        if (alive) setOrders(data)
      })
      .catch((err) => {
        if (alive) setError(err instanceof Error ? err.message : 'Could not load orders')
      })
    return () => {
      alive = false
    }
  }, [])

  if (error) {
    return <p className="text-sm text-brand-red">{error}</p>
  }

  if (orders === null) {
    return <p className="text-sm text-muted">Loading orders…</p>
  }

  if (!orders.length) {
    return (
      <div>
        <p className="text-sm text-muted">No completed orders yet.</p>
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
    <div className="overflow-x-auto">
      <table className="w-full min-w-[32rem] text-left text-sm">
        <thead>
          <tr className="border-b border-line font-display text-[10px] tracking-[0.16em] uppercase text-muted">
            <th className="pb-3 pr-4 font-normal">Order</th>
            <th className="pb-3 pr-4 font-normal">Date</th>
            <th className="pb-3 pr-4 font-normal">Status</th>
            <th className="pb-3 text-right font-normal">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-line/70">
              <td className="py-4 pr-4 font-medium text-ink">{order.number}</td>
              <td className="py-4 pr-4 text-muted">{formatDate(order.completed_at)}</td>
              <td className="py-4 pr-4 capitalize text-muted">
                {order.payment_state || order.state || '—'}
              </td>
              <td className="py-4 text-right text-ink">{order.display_total || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
