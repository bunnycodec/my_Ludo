/* Player Dashboard — the landing page after login.
 *
 * Stats are still placeholders (wired in Phase 6). Game invites are real as of
 * Phase 3: refresh-on-demand rather than push, per the spec's no-notifications
 * design and the user's preference for a manual Refresh button — the family
 * coordinates timing over WhatsApp, not in-app alerts. */

import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as api from '../api'
import { useAuth } from '../auth'
import { Button, Card, EmptyState, ErrorNote } from '../components'

// Placeholder stat tiles — wired to real per-player totals in Phase 6.
const STATS = [
  { label: 'Total Points', value: 0 },
  { label: 'Games Played', value: 0 },
  { label: 'Wins', value: 0 },
  { label: 'Win %', value: '—' },
  { label: 'Tokens Cut', value: 0 },
  { label: 'Sixes Rolled', value: 0 },
]

function MyGames({ needsResponse, waiting, onRefresh, onRespond, busyId, error }) {
  const loading = needsResponse === null || waiting === null
  const empty = !loading && needsResponse.length === 0 && waiting.length === 0

  return (
    <Card
      title="Games"
      action={
        <Button variant="subtle" onClick={onRefresh}>
          Refresh
        </Button>
      }
    >
      <ErrorNote>{error}</ErrorNote>
      {loading ? (
        <p className="text-sm text-ink-soft">Loading…</p>
      ) : empty ? (
        <EmptyState>No pending invites or games waiting to start. Hit refresh if you're expecting one.</EmptyState>
      ) : (
        <div className="space-y-4">
          {needsResponse.length > 0 && (
            <ul className="divide-y divide-line">
              {needsResponse.map(({ game, invite }) => (
                <li key={invite.id} className="flex flex-wrap items-center gap-2 py-3">
                  <div>
                    <span className="font-bold">{game.creator.username}</span>
                    <span className="text-sm text-ink-soft"> invited you to a game</span>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <Button
                      variant="subtle"
                      disabled={busyId === invite.id}
                      onClick={() => onRespond(game.id, invite.id, 'decline')}
                    >
                      Decline
                    </Button>
                    <Button
                      disabled={busyId === invite.id}
                      onClick={() => onRespond(game.id, invite.id, 'accept')}
                    >
                      Accept
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {waiting.length > 0 && (
            <ul className="divide-y divide-line">
              {waiting.map((game) => (
                <li key={game.id} className="py-3">
                  <span className="font-bold">{game.creator.username}'s game</span>
                  <span className="ml-2 rounded-full bg-parchment px-2 py-0.5 text-xs font-bold text-ink-soft">
                    Waiting for {game.creator.username} to start
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Card>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeGame, setActiveGame] = useState(null) // null = loading, undefined-ish "none" = false-y after load
  const [hasDraft, setHasDraft] = useState(null) // null = loading
  const [needsResponse, setNeedsResponse] = useState(null)
  const [waiting, setWaiting] = useState(null)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  // One shared refresh: the "Create Game" vs "Enter Room" vs blocked button state
  // and the Games card must always agree, so they're driven by the same fetch.
  async function refresh() {
    setError('')
    try {
      const [active, drafts, invited, accepted] = await Promise.all([
        api.listActiveGames(),
        api.listPendingCreatedGames(),
        api.listPendingInvites(),
        api.listWaitingToStart(),
      ])
      setActiveGame(active[0] ?? false)
      setHasDraft(drafts.length > 0)
      setNeedsResponse(
        invited.map((g) => ({ game: g, invite: g.invites.find((i) => i.user.id === user.id) })),
      )
      setWaiting(accepted)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function respond(gameId, inviteId, action) {
    setBusyId(inviteId)
    setError('')
    try {
      await (action === 'accept' ? api.acceptInvite : api.declineInvite)(gameId, inviteId)
      await refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  const loadingButton = activeGame === null || hasDraft === null
  // Already playing, or already committed to someone else's game (accepted, not
  // yet started)? Can't open a room of your own until that resolves — one game
  // at a time.
  const blockedByOtherGame =
    !loadingButton && !activeGame && !hasDraft && waiting !== null && waiting.length > 0

  function handleGameButton() {
    if (activeGame) navigate(`/game/${activeGame.id}`)
    else navigate('/build-game')
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Hi, {user.username}</h1>
          <p className="text-sm text-ink-soft">Ready for a game?</p>
        </div>
        <Button
          onClick={handleGameButton}
          disabled={loadingButton || blockedByOtherGame}
          title={
            blockedByOtherGame
              ? "You've already joined another game — that one has to start or end first."
              : undefined
          }
        >
          {activeGame || hasDraft ? 'Enter Room' : 'Create Game'}
        </Button>
      </div>

      <Card title="Your Stats">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-xl bg-parchment/60 px-4 py-3">
              <div className="text-xl font-extrabold">{s.value}</div>
              <div className="text-xs font-semibold text-ink-soft">{s.label}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-soft">
          Stats fill in once games are played and confirmed.
        </p>
      </Card>

      <MyGames
        needsResponse={needsResponse}
        waiting={waiting}
        onRefresh={refresh}
        onRespond={respond}
        busyId={busyId}
        error={error}
      />

      {user.role === 'admin' && (
        <Card
          title="Pending Confirmations"
          action={
            <span className="rounded-full bg-parchment px-2.5 py-0.5 text-xs font-bold text-ink-soft">
              0
            </span>
          }
        >
          <EmptyState>Finished games awaiting your Confirm/Reject will appear here.</EmptyState>
        </Card>
      )}

      <Card title="Account">
        <Link to="/change-password" className="text-sm font-bold text-pine hover:underline">
          Change Password →
        </Link>
      </Card>
    </div>
  )
}
