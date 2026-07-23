/* Login page. No registration link by design — accounts are admin-provisioned.
 * On success: straight to the Dashboard, unless the account is on a temp
 * password, in which case the change-password screen comes first. */

import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { Button, ErrorNote, Field, Logo } from '../components'

export default function Login() {
  const { user, checking, login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // Already logged in (e.g. typed /login by hand) — nothing to do here.
  if (!checking && user) return <Navigate to="/" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const data = await login(username, password)
      navigate(data.must_change_password ? '/change-password' : '/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3 animate-page-rise">
          <Logo size={48} />
          <h1 className="text-2xl font-extrabold">Codec Ludo</h1>
          <p className="text-center text-sm text-ink-soft">
            Invite only — want in? Reach out at{' '}
            <a href="mailto:sunnykumar@bunnycodec.com" className="font-bold text-pine hover:underline">
              sunnykumar@bunnycodec.com
            </a>
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-line bg-white p-6 shadow-sm animate-page-rise"
        >
          <Field
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
            required
          />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <ErrorNote>{error}</ErrorNote>
          <Button type="submit" disabled={busy} style={{ width: '100%' }}>
            {busy ? 'Logging In…' : 'Log In'}
          </Button>
        </form>
      </div>
    </div>
  )
}
