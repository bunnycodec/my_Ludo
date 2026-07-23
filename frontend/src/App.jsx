/* Route map for the whole app.
 *
 * Nesting mirrors the backend's guards: everything inside <RequireAuth> needs a
 * valid session; /members additionally sits inside <RequireAdmin>. The backend
 * still enforces both on every request — these client-side guards are just for
 * a sensible UX (no admin links shown to players, no flash of private pages). */

import { Route, Routes } from 'react-router-dom'
import { RequireAdmin, RequireAuth } from './auth'
import Layout from './Layout'
import AboutDeveloper from './pages/AboutDeveloper'
import BuildGame from './pages/BuildGame'
import ChangePassword from './pages/ChangePassword'
import Dashboard from './pages/Dashboard'
import GamePage from './pages/GamePage'
import Leaderboard from './pages/Leaderboard'
import Login from './pages/Login'
import MembersArea from './pages/MembersArea'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/about" element={<AboutDeveloper />} />
          <Route path="/build-game" element={<BuildGame />} />
          <Route path="/game/:gameId" element={<GamePage />} />
          <Route element={<RequireAdmin />}>
            <Route path="/members" element={<MembersArea />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
