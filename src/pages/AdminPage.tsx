import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { staticCatalog } from '../data/catalog'
import {
  applyCatalogOverrides,
  loadCatalogOverrides,
  saveCatalogOverrides,
  type CatalogOverride,
} from '../data/catalogOverrides'
import { collections, type Product } from '../data/products'
import { PREVIEW_PASSWORD, unlockPreview } from '../config'

const ADMIN_UNLOCK_KEY = 'cw_admin_unlocked'

function isAdminUnlocked() {
  try {
    return window.localStorage.getItem(ADMIN_UNLOCK_KEY) === '1'
  } catch {
    return false
  }
}

export function AdminPage() {
  const [authed, setAuthed] = useState(() => isAdminUnlocked())
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [overrides, setOverrides] = useState(() => loadCatalogOverrides())
  const [saved, setSaved] = useState(false)

  const products = useMemo(
    () => applyCatalogOverrides(staticCatalog, overrides),
    [overrides],
  )

  const onLogin = (e: FormEvent) => {
    e.preventDefault()
    if (password === PREVIEW_PASSWORD) {
      window.localStorage.setItem(ADMIN_UNLOCK_KEY, '1')
      unlockPreview()
      setAuthed(true)
      setError(false)
      return
    }
    setError(true)
  }

  const patchProduct = (id: string, patch: CatalogOverride) => {
    setOverrides((prev) => {
      const next = {
        ...prev,
        [id]: { ...prev[id], ...patch },
      }
      return next
    })
    setSaved(false)
  }

  const onSave = () => {
    saveCatalogOverrides(overrides)
    setSaved(true)
  }

  const onExport = () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'commonwealth-catalog.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!authed) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
        <h1 className="font-display text-3xl tracking-tight text-ink">Admin</h1>
        <p className="mt-2 text-sm text-muted">
          Catalog admin for the live site — no separate commerce host required.
        </p>
        <form className="mt-8 space-y-4" onSubmit={onLogin}>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(false)
            }}
            className="w-full border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink"
            required
          />
          <button
            type="submit"
            className="w-full bg-ink px-4 py-2 text-sm uppercase tracking-wider text-paper"
          >
            Enter
          </button>
          {error && <p className="text-sm text-brand-red">Incorrect password.</p>}
        </form>
        <p className="mt-8 text-xs text-muted">
          Full local commerce admin (orders, stock, etc.): run{' '}
          <code className="text-ink">npm run commerce:dev</code> then open{' '}
          <a className="underline" href="http://localhost:3001/admin">
            localhost:3001/admin
          </a>
          .
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">Commonwealth Seed Co</p>
          <h1 className="font-display text-3xl tracking-tight text-ink">Catalog admin</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Edits save in this browser and update the shop immediately. Export JSON if you want
            changes checked into the repo. No hosted commerce backend required.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/shop" className="border border-line px-3 py-2 text-xs uppercase tracking-wider">
            View shop
          </Link>
          <button
            type="button"
            onClick={onExport}
            className="border border-line px-3 py-2 text-xs uppercase tracking-wider"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={onSave}
            className="bg-ink px-3 py-2 text-xs uppercase tracking-wider text-paper"
          >
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted">
        {products.length} products · local commerce UI:{' '}
        <a className="underline" href="http://localhost:3001/admin">
          localhost:3001/admin
        </a>{' '}
        (<code>spree@example.com</code> / <code>spree123</code>)
      </p>

      <div className="mt-10 space-y-10">
        {collections.map((collection) => {
          const list = products.filter((p) => p.line === collection.id)
          return (
            <section key={collection.id}>
              <h2 className="font-display text-xl text-ink">{collection.name}</h2>
              <p className="text-xs text-muted">{list.length} strains</p>
              <ul className="mt-4 divide-y divide-line border border-line">
                {list.map((product) => (
                  <AdminProductRow
                    key={product.id}
                    product={product}
                    onChange={(patch) => patchProduct(product.id, patch)}
                  />
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </main>
  )
}

function AdminProductRow({
  product,
  onChange,
}: {
  product: Product
  onChange: (patch: CatalogOverride) => void
}) {
  return (
    <li className="grid gap-3 px-4 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <div className="font-medium text-ink">{product.name}</div>
        <div className="text-xs text-muted">{product.lineage}</div>
        <label className="mt-2 block text-xs text-muted">
          Description
          <textarea
            className="mt-1 w-full border border-line bg-white px-2 py-1 text-sm text-ink"
            rows={2}
            value={product.description}
            onChange={(e) => onChange({ description: e.target.value })}
          />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-muted">$</span>
          <input
            type="number"
            min={0}
            step={1}
            className="w-20 border border-line px-2 py-1"
            value={product.price}
            onChange={(e) => onChange({ price: Number(e.target.value) || 0 })}
          />
        </label>
        <label className="flex items-center gap-2 text-xs uppercase tracking-wider">
          <input
            type="checkbox"
            checked={product.comingSoon}
            onChange={(e) => onChange({ comingSoon: e.target.checked })}
          />
          Coming soon
        </label>
        <label className="flex items-center gap-2 text-xs uppercase tracking-wider">
          <input
            type="checkbox"
            checked={Boolean(product.featured)}
            onChange={(e) => onChange({ featured: e.target.checked })}
          />
          Featured
        </label>
      </div>
    </li>
  )
}
