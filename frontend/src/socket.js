/* Thin wrapper around socket.io-client — the one place in the app that gets a
 * live push instead of a manual refresh (see CLAUDE.md's Phase 4 notes for why
 * the game board works this way but invites deliberately don't). The httpOnly
 * auth cookie is sent automatically with the socket handshake since it's a
 * same-origin request, same as every fetch() call in api.js. */

import { io } from 'socket.io-client'

let socket = null

export function getSocket() {
  if (!socket) {
    socket = io({ autoConnect: false, withCredentials: true })
  }
  return socket
}

/** Connect (if needed) and join a game's room. Call the returned cleanup
 * function on unmount to leave the room and drop the listener. */
export function watchGame(gameId, onBoardChanged) {
  const sock = getSocket()

  function join() {
    sock.emit('join_game', { game_id: gameId })
  }

  function handleUpdate(data) {
    if (data.game_id === gameId) onBoardChanged()
  }

  sock.on('board_updated', handleUpdate)
  sock.on('connect', join)
  if (sock.connected) join()
  else sock.connect()

  return () => {
    sock.off('board_updated', handleUpdate)
    sock.off('connect', join)
  }
}
