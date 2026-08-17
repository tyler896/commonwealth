import { useEffect } from 'react'

/** Leave the SPA and open Spree admin login (hosted behind nginx). */
export function SpreeAdminRedirect() {
  useEffect(() => {
    window.location.replace('/admin_user/sign_in')
  }, [])
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6">
      <p className="text-sm text-muted">Opening admin…</p>
    </main>
  )
}
