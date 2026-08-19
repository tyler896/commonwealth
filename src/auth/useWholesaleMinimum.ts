import { useEffect, useState } from 'react'
import { fetchWholesaleTiers, type WholesaleTierInfo } from '../api/commerce'
import { useAuth } from './AuthContext'

export function useWholesaleMinimum() {
  const { user, isB2B } = useAuth()
  const [tiers, setTiers] = useState<WholesaleTierInfo[]>([])

  useEffect(() => {
    let alive = true
    fetchWholesaleTiers().then((rows) => {
      if (alive) setTiers(rows)
    })
    return () => {
      alive = false
    }
  }, [])

  const names = (user?.customer_groups || []).map((g) => g.name.toLowerCase())
  const tierKey = names.includes('distro')
    ? 'distro'
    : names.includes('wholesale')
      ? 'wholesale'
      : null
  const tier = tiers.find((t) => t.tier === tierKey) || null
  const minimum = tier?.minimum_order_amount ?? 0

  return {
    isB2B,
    tierLabel: tier?.name || null,
    minimum,
    meetsMinimum: (subtotal: number) => !isB2B || minimum <= 0 || subtotal >= minimum,
    remaining: (subtotal: number) => Math.max(0, minimum - subtotal),
  }
}
