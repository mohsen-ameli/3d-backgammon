import { useContext, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import useAxios from "./useAxios"
import notification from "../utils/Notification"
import { AuthContext } from "../../context/AuthContext"
import { BaseUser } from "../../context/BaseUser.type"
import wsGood from "../utils/wsGood"
import { GameWrapperContext } from "../../game/context/GameWrapperContext"

type DataType = {
  live_game?: string
  rejected_request?: BaseUser
  game_requests?: BaseUser[]
}

const useStatus = () => {
  const { ws } = useContext(AuthContext)
  const { inGame } = useContext(GameWrapperContext)

  const axiosInstance = useAxios()
  const navigate = useNavigate()

  // Needed for game request notifications
  const showReqNotif = useRef(true)
  const showRejNotif = useRef(true)

  // Accepting a game request
  const accept = async (id: number) => {
    const res = await axiosInstance.put("/api/game/handle-match-request/", {
      action: "accept",
      friend_id: id,
    })

    if (res.status !== 200) return

    const data = res.data
    navigate(`/game/${data.game_id}`)
  }

  // Rejecting the game request
  const reject = async (id: number) => {
    await axiosInstance.put("/api/game/handle-match-request/", {
      action: "reject",
      friend_id: id,
    })
    showReqNotif.current = true
  }

  // Handling updates coming from the backend
  const onMessage = (e: MessageEvent) => {
    const data: DataType = JSON.parse(e.data)

    if (data.live_game) {
      navigate(`/game/${data.live_game}`)
    }

    // If there are rejected requests
    if (data.rejected_request && showRejNotif.current) {
      // Making sure we show the notifications only once
      showRejNotif.current = false

      // Showing a notification
      const msg = `${data.rejected_request.username} rejected your match request.`
      notification(msg, "deleteRejected")
    }

    // If there are game requests
    if (data.game_requests?.length! > 0 && showReqNotif.current) {
      // Making sure we show the notifications only once
      showReqNotif.current = false

      // Showing all game requests of a user
      data.game_requests?.map(user =>
        notification(
          `${user.username} wants to play with you.`,
          "match",
          () => reject(user.id),
          () => accept(user.id)
        )
      )
    }
  }

  useEffect(() => {
    if (!ws || inGame) return

    // User is not in game, so making sure the websocket is running
    if (wsGood(ws)) ws.send(JSON.stringify({ paused: false }))

    ws.addEventListener("message", onMessage)

    // When user logs out, or starts a game
    return () => {
      ws.removeEventListener("message", onMessage)

      // Pausing the websocket from sending updates
      if (wsGood(ws)) ws.send(JSON.stringify({ paused: true }))

      // Reseting notification references
      showRejNotif.current = true
      showReqNotif.current = true
    }
  }, [ws, inGame])
}

export default useStatus
