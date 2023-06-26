import { getSession } from "next-auth/react"

/**
 * Sends a call to set the winner of the game
 */
export default async function updateGameWinner(ws: WebSocket) {
  const session = await getSession()
  const context = { finished: true, winner: session?.user.id }
  ws.send(JSON.stringify(context))
}
