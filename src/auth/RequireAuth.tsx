import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function RequireAuth() {
  const { user, ready } = useAuth()
  const location = useLocation()

  if (!ready) {
    return (
      <div className="section-pad mx-auto max-w-3xl py-32 text-center text-muted md:py-40">
        Loading account…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/account/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
