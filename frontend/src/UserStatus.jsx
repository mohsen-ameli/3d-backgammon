import { useContext, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import useAxios from "./components/hooks/useAxios"
import getServerUrl from "./components/utils/getServerUrl"
import notification from "./components/utils/Notification"
import { AuthContext } from "./context/AuthContext"

const useStatus = () => {
  const axiosInstance = useAxios()
  const navigate = useNavigate()
  const { ws, inGame } = useContext(AuthContext)

  // Needed for game request notifications
  const showReqNotif = useRef(true)
  const showRejNotif = useRef(true)

  // Accepting a game request
  const accept = async (id) => {
    const res = await axiosInstance.put(
      `${getServerUrl()}/api/game/handle-match-request/`,
      {
        action: "accept",
        friend_id: id,
      }
    )

    if (res.status !== 200) return

    const data = res.data
    navigate(`/game/${data.game_id}`)
  }

  // Rejecting the game request
  const reject = async (id) => {
    await axiosInstance.put(
      `${getServerUrl()}/api/game/handle-match-request/`,
      {
        action: "reject",
        friend_id: id,
      }
    )
    showReqNotif.current = true
  }

  // Deleting a "game request rejected" message
  const deleteRejected = async () => {
    await axiosInstance.put(
      `${getServerUrl()}/api/game/handle-match-request/`,
      {
        action: "delete-rejected",
      }
    )
    showRejNotif.current = true
  }

  // Handling updates coming from the backend
  const onMessage = (e) => {
    const data = JSON.parse(e.data)

    if (data["live_game"]) {
      navigate(`/game/${data["live_game"]}`)
    }

    // If there are rejected requests
    if (data["rejected_request"] && showRejNotif.current) {
      // Making sure we show the notifications only once
      showRejNotif.current = false

      // Showing a notification
      notification(
        `${data["rejected_request"].username} rejected your match request.`,
        "deleteRejected",
        { deleteRejected }
      )
    }

    // If there are game requests
    if (data["game_requests"].length > 0 && showReqNotif.current) {
      // Making sure we show the notifications only once
      showReqNotif.current = false

      // Showing all game requests of a user
      data["game_requests"].map((req) =>
        notification(`${req.username} wants to play with you.`, "match", {
          accept: () => accept(req.id),
          reject: () => reject(req.id),
        })
      )
    }
  }

  useEffect(() => {
    if (!ws || inGame) return

    // User is not in game, so making sure the websocket is running
    if (ws.readyState !== WebSocket.CONNECTING)
      ws.send(JSON.stringify({ paused: false }))

    ws.addEventListener("message", onMessage)

    return () => {
      ws.removeEventListener("message", onMessage)

      // Pausing the websocket from sending updates
      if (ws.readyState !== WebSocket.CONNECTING)
        ws.send(JSON.stringify({ paused: true }))

      // Reseting notification references
      showRejNotif.current = true
      showReqNotif.current = true
    }
  }, [ws, inGame])
}

export default useStatus
