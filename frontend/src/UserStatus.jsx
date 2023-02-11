import { useContext, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import useAxios from "./components/hooks/useAxios"
import notification from "./components/utils/Notification"
import { AuthContext } from "./context/AuthContext"

const useStatus = () => {
  const axiosInstance = useAxios()
  const navigate = useNavigate()
  const { ws, inGame } = useContext(AuthContext)

  // Needed for game request notifications
  const showReqNotif = useRef(true)
  const showRejNotif = useRef(true)

  const accept = async (id) => {
    const res = await axiosInstance.put("api/game/handle-match-request/", {
      action: "accept",
      friend_id: id,
    })

    if (res.status === 200) {
      const data = res.data
      console.log(data)
      navigate(`/friend-game/${data.game_id}/`)
      return
    }
  }

  const reject = async (id) => {
    await axiosInstance.put("api/game/handle-match-request/", {
      action: "reject",
      friend_id: id,
    })
    showReqNotif.current = true
  }

  const deleteRejected = async () => {
    await axiosInstance.put("api/game/handle-match-request/", {
      action: "delete-rejected",
    })
    showRejNotif.current = true
  }

  useEffect(() => {
    if (!ws) return

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data)

      if (inGame) return

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

    return () => {
      ws && ws.close()
    }
  }, [ws])
}

export default useStatus
