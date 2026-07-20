/* Leaderboard skeleton — the real 8-column structure from the spec, with no data
 * behind it yet. Phase 6 wires it to live confirmed-game totals. */

import { Card, EmptyState } from '../components'

const COLUMNS = [
  'Rank',
  'Player',
  'Total Points',
  'Games Played',
  'Wins',
  'Win %',
  'Tokens Cut',
  'Sixes Rolled',
]

export default function Leaderboard() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold">Leaderboard</h1>
      <Card>
        {/* The table is wider than a phone screen; it scrolls sideways inside the
            card instead of stretching the page. */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs font-bold text-ink-soft">
                {COLUMNS.map((c) => (
                  <th key={c} className="whitespace-nowrap px-3 py-2">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{/* rows arrive in Phase 6 */}</tbody>
          </table>
        </div>
        {/* Outside the scroll container so the message never gets clipped */}
        <div className="mt-3">
          <EmptyState>
            No confirmed games yet — the table fills in once games are played and the admin
            confirms them.
          </EmptyState>
        </div>
      </Card>
    </div>
  )
}
