/**
 * If the websocket is open, returns true, else false
 */
const wsGood = (ws: WebSocket) => {
  if (
    ws.readyState !== WebSocket.CLOSED &&
    ws.readyState !== WebSocket.CONNECTING
  )
    return true
  return false
}

export default wsGood
