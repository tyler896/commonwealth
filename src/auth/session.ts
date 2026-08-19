const TOKEN_KEY = 'cw-auth-token'
const REFRESH_KEY = 'cw-auth-refresh'
const USER_KEY = 'cw-auth-user'

export type AuthUser = {
  id: string
  email: string
  first_name?: string | null
  last_name?: string | null
  full_name?: string
  customer_groups: { id: string; name: string }[]
}

export type AuthSession = {
  token: string
  refreshToken: string
  user: AuthUser
}

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function loadAuthSession(): AuthSession | null {
  const token = localStorage.getItem(TOKEN_KEY)
  const refreshToken = localStorage.getItem(REFRESH_KEY)
  const user = readJson<AuthUser>(USER_KEY)
  if (!token || !refreshToken || !user) return null
  return { token, refreshToken, user }
}

export function saveAuthSession(session: AuthSession) {
  localStorage.setItem(TOKEN_KEY, session.token)
  localStorage.setItem(REFRESH_KEY, session.refreshToken)
  localStorage.setItem(USER_KEY, JSON.stringify(session.user))
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function wholesaleTierFromUser(user: AuthUser | null | undefined): {
  isWholesale: boolean
  isDistro: boolean
  label: string | null
} {
  const names = (user?.customer_groups || []).map((g) => g.name.toLowerCase())
  const isDistro = names.includes('distro')
  const isWholesale = names.includes('wholesale')
  return {
    isWholesale,
    isDistro,
    label: isDistro ? 'Distro' : isWholesale ? 'Wholesale' : null,
  }
}
