import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { loginCustomer, registerCustomer, fetchCurrentCustomer } from '../api/commerce'
import {
  clearAuthSession,
  loadAuthSession,
  saveAuthSession,
  wholesaleTierFromUser,
  type AuthSession,
  type AuthUser,
} from './session'

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  ready: boolean
  tierLabel: string | null
  isB2B: boolean
  login: (email: string, password: string) => Promise<void>
  register: (payload: {
    email: string
    password: string
    password_confirmation?: string
    first_name?: string
    last_name?: string
  }) => Promise<void>
  logout: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setSession(loadAuthSession())
    setReady(true)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const next = await loginCustomer(email, password)
    saveAuthSession(next)
    setSession(next)
  }, [])

  const register = useCallback(
    async (payload: {
      email: string
      password: string
      password_confirmation?: string
      first_name?: string
      last_name?: string
    }) => {
      const next = await registerCustomer(payload)
      saveAuthSession(next)
      setSession(next)
    },
    [],
  )

  const logout = useCallback(() => {
    clearAuthSession()
    setSession(null)
  }, [])

  const refreshProfile = useCallback(async () => {
    const token = session?.token || loadAuthSession()?.token
    if (!token) return
    const user = await fetchCurrentCustomer(token)
    const current = loadAuthSession()
    if (!current) return
    const next = { ...current, user }
    saveAuthSession(next)
    setSession(next)
  }, [session?.token])

  const tiers = wholesaleTierFromUser(session?.user)
  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      ready,
      tierLabel: tiers.label,
      isB2B: Boolean(tiers.label),
      login,
      register,
      logout,
      refreshProfile,
    }),
    [session, ready, tiers.label, login, register, logout, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
