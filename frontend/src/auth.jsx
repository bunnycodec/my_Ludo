/* App-wide login state.
 *
 * AuthProvider wraps the whole app (see main.jsx). On first load it asks the
 * backend "who am I?" (/auth/me) — the httpOnly cookie decides the answer, so a
 * refreshed page stays logged in. Any component can call useAuth() to read the
 * current user or trigger login/logout.
 *
 * This is also where the single-session rule becomes visible: if another device
 * logs into the same account, our next API call returns 401, and the route guard
 * below redirects to the login page.
 */

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import * as api from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // true until the initial /auth/me check finishes — prevents a logged-in user
  // from being flashed to the login page while the check is in flight.
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    api
      .fetchMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setChecking(false))
  }, [])

  const login = useCallback(async (username, password) => {
    const data = await api.login(username, password)
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } finally {
      // Even if the server call fails (e.g. session already dead), drop local
      // state so the UI returns to the login page.
      setUser(null)
    }
  }, [])

  // api.js fires this event when any call comes back 401: the session is gone
  // (expired, or another device logged in). Resetting user to null makes
  // RequireAuth redirect to the login page.
  useEffect(() => {
    const onExpired = () => setUser(null)
    window.addEventListener('session-expired', onExpired)
    return () => window.removeEventListener('session-expired', onExpired)
  }, [])

  return (
    <AuthContext.Provider value={{ user, checking, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

/* Route guards — used in App.jsx to wrap pages.
 * <RequireAuth> renders its child routes only when logged in; otherwise it
 * redirects to /login. <RequireAdmin> additionally requires the admin role. */

export function RequireAuth() {
  const { user, checking } = useAuth()
  const location = useLocation()
  if (checking) return null // brief blank while the initial /auth/me runs
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  // Accounts on a temp password must set their own before using the app.
  if (user.must_change_password && location.pathname !== '/change-password')
    return <Navigate to="/change-password" replace />
  return <Outlet />
}

export function RequireAdmin() {
  const { user } = useAuth()
  if (user?.role !== 'admin') return <Navigate to="/" replace />
  return <Outlet />
}
