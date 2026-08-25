import { Navigate } from 'react-router-dom'

/** Trade login uses the shared customer account. */
export function WholesaleLoginPage() {
  return <Navigate to="/account/login" replace />
}
