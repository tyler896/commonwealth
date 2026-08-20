import { useEffect, useState, type FormEvent } from 'react'
import {
  createCustomerAddress,
  deleteCustomerAddress,
  fetchCustomerAddresses,
  type AddressInput,
  type CustomerAddress,
} from '../../api/commerce'

const fieldClass =
  'mt-1.5 w-full rounded-full border border-line bg-paper px-5 py-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'

const emptyForm: AddressInput = {
  first_name: '',
  last_name: '',
  address1: '',
  address2: '',
  city: '',
  postal_code: '',
  country_iso: 'US',
  state_abbr: '',
  phone: '',
  company: '',
  is_default_shipping: false,
  is_default_billing: false,
}

export function AccountAddressesPage() {
  const [addresses, setAddresses] = useState<CustomerAddress[] | null>(null)
  const [form, setForm] = useState<AddressInput>(emptyForm)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    const data = await fetchCustomerAddresses()
    setAddresses(data)
  }

  useEffect(() => {
    let alive = true
    fetchCustomerAddresses()
      .then((data) => {
        if (alive) setAddresses(data)
      })
      .catch((err) => {
        if (alive) setError(err instanceof Error ? err.message : 'Could not load addresses')
      })
    return () => {
      alive = false
    }
  }, [])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await createCustomerAddress({
        ...form,
        address2: form.address2 || undefined,
        phone: form.phone || undefined,
        company: form.company || undefined,
        state_abbr: form.state_abbr || undefined,
      })
      setForm(emptyForm)
      setOpen(false)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save address')
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (id: string) => {
    if (!confirm('Remove this address?')) return
    setError(null)
    try {
      await deleteCustomerAddress(id)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete address')
    }
  }

  if (addresses === null && !error) {
    return <p className="text-sm text-muted">Loading addresses…</p>
  }

  return (
    <div className="space-y-8">
      {error && <p className="text-sm text-brand-red">{error}</p>}

      {addresses && addresses.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <li key={addr.id} className="border border-line p-5">
              <p className="font-medium text-ink">{addr.full_name}</p>
              {addr.company && <p className="mt-1 text-sm text-muted">{addr.company}</p>}
              <p className="mt-2 text-sm text-muted">
                {addr.address1}
                {addr.address2 ? `, ${addr.address2}` : ''}
                <br />
                {addr.city}
                {addr.state_abbr ? `, ${addr.state_abbr}` : ''} {addr.postal_code}
                <br />
                {addr.country_name || addr.country_iso}
              </p>
              {(addr.is_default_shipping || addr.is_default_billing) && (
                <p className="mt-3 font-display text-[9px] tracking-[0.14em] uppercase text-leaf">
                  {[
                    addr.is_default_shipping ? 'Default shipping' : null,
                    addr.is_default_billing ? 'Default billing' : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              )}
              <button
                type="button"
                onClick={() => onDelete(addr.id)}
                className="mt-4 font-display text-[10px] tracking-[0.16em] uppercase text-ink/45 transition hover:text-brand-red"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">No saved addresses yet.</p>
      )}

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex rounded-full border border-line px-6 py-3 font-display text-[10px] tracking-[0.2em] uppercase text-ink transition hover:border-ink/40"
        >
          Add address
        </button>
      ) : (
        <form onSubmit={onSubmit} className="max-w-xl space-y-4 border border-line p-5 md:p-6">
          <h3 className="font-display text-sm tracking-[0.12em] uppercase text-ink">New address</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-display text-[10px] tracking-[0.16em] uppercase text-muted">
                First name
              </span>
              <input
                required
                value={form.first_name}
                onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm">
              <span className="font-display text-[10px] tracking-[0.16em] uppercase text-muted">
                Last name
              </span>
              <input
                required
                value={form.last_name}
                onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
                className={fieldClass}
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="font-display text-[10px] tracking-[0.16em] uppercase text-muted">
              Company
            </span>
            <input
              value={form.company || ''}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm">
            <span className="font-display text-[10px] tracking-[0.16em] uppercase text-muted">
              Address
            </span>
            <input
              required
              value={form.address1}
              onChange={(e) => setForm((f) => ({ ...f, address1: e.target.value }))}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm">
            <span className="font-display text-[10px] tracking-[0.16em] uppercase text-muted">
              Apt / suite
            </span>
            <input
              value={form.address2 || ''}
              onChange={(e) => setForm((f) => ({ ...f, address2: e.target.value }))}
              className={fieldClass}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm sm:col-span-1">
              <span className="font-display text-[10px] tracking-[0.16em] uppercase text-muted">
                City
              </span>
              <input
                required
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm">
              <span className="font-display text-[10px] tracking-[0.16em] uppercase text-muted">
                State
              </span>
              <input
                value={form.state_abbr || ''}
                onChange={(e) => setForm((f) => ({ ...f, state_abbr: e.target.value.toUpperCase() }))}
                maxLength={2}
                placeholder="CA"
                className={fieldClass}
              />
            </label>
            <label className="block text-sm">
              <span className="font-display text-[10px] tracking-[0.16em] uppercase text-muted">
                ZIP
              </span>
              <input
                required
                value={form.postal_code}
                onChange={(e) => setForm((f) => ({ ...f, postal_code: e.target.value }))}
                className={fieldClass}
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="font-display text-[10px] tracking-[0.16em] uppercase text-muted">
              Phone
            </span>
            <input
              type="tel"
              value={form.phone || ''}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className={fieldClass}
            />
          </label>
          <div className="flex flex-wrap gap-4 text-sm text-muted">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(form.is_default_shipping)}
                onChange={(e) => setForm((f) => ({ ...f, is_default_shipping: e.target.checked }))}
              />
              Default shipping
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(form.is_default_billing)}
                onChange={(e) => setForm((f) => ({ ...f, is_default_billing: e.target.checked }))}
              />
              Default billing
            </label>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex rounded-full bg-brand-red px-6 py-3 font-display text-[10px] tracking-[0.2em] uppercase text-white transition hover:bg-brand-red-deep disabled:opacity-70"
            >
              {saving ? 'Saving…' : 'Save address'}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                setForm(emptyForm)
              }}
              className="inline-flex rounded-full border border-line px-6 py-3 font-display text-[10px] tracking-[0.2em] uppercase text-ink transition hover:border-ink/40"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
