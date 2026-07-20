/* Change-password page. Reached voluntarily from the Dashboard, or forcibly —
 * accounts still on an admin-issued temp password are redirected here and can't
 * use the rest of the app until they've set their own (see RequireAuth). */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as api from '../api'
import { useAuth } from '../auth'
import { Button, Card, ErrorNote, Field } from '../components'

export default function ChangePassword() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const forced = user.must_change_password

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (next !== confirm) {
      setError('New passwords do not match.')
      return
    }
    setBusy(true)
    try {
      const updated = await api.changePassword(current, next)
      setUser(updated) // must_change_password is now false — unlocks the app
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-4">
      {forced && (
        <p className="rounded-xl border border-line bg-parchment/60 px-4 py-3 text-sm font-semibold">
          Welcome! You're on a temporary password — set your own to continue.
        </p>
      )}
      <Card title="Change Password">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field
            label={forced ? 'Temporary password' : 'Current password'}
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            autoComplete="current-password"
            required
          />
          <Field
            label="New password (min 8 characters)"
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
          <Field
            label="Repeat new password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
          <ErrorNote>{error}</ErrorNote>
          <Button type="submit" disabled={busy} style={{ width: '100%' }}>
            {busy ? 'Saving…' : 'Save New Password'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
