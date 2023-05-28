"use client"

import { BaseUser } from "@/types/User.type"
import { useEffect, useRef, useState } from "react"
import notification from "../utils/Notification"
import AxiosInstance from "../utils/AxiosInstance"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useGameStore } from "@/game/store/useGameStore"
import getServerUrl from "../utils/getServerUrl"

type DataType = {
  live_game?: string
  game_requests?: BaseUser[]
}

export default function useStatus() {
  const inGame = useGameStore(state => state.inGame)

  const router = useRouter()
  const { data: session } = useSession()
  const axiosInstance = AxiosInstance(session!)

  const [ws, setWs] = useState<WebSocket | null>(null)

  // Needed for game request notifications
  const showReqNotif = useRef(true)
  const showRejNotif = useRef(true)

  useEffect(() => {
    if (!session || ws) return

    setWs(() => new WebSocket(`${getServerUrl(false)}/ws/status/${session.user.id}`))
  }, [session])

  useEffect(() => {
    if (!ws || inGame) return

    ws.addEventListener("message", onMessage)

    // When user logs out, or starts a game
    return () => {
      ws.removeEventListener("message", onMessage)

      // Resetting notification references
      showRejNotif.current = true
      showReqNotif.current = true
    }
  }, [ws, inGame])

  // Accepting a game request
  async function accept(id: string) {
    const res = await axiosInstance.put("/api/game/handle-match-request/", {
      action: "accept",
      friend_id: id,
    })

    if (res.status !== 200) {
      notification("Something went wrong... Please try again!", "error")
    }

    const data = res.data
    router.push(`/game/${data.game_id}`)
  }

  // Rejecting the game request
  async function reject(id: string) {
    const res = await axiosInstance.put("/api/game/handle-match-request/", {
      action: "reject",
      friend_id: id,
    })

    if (res.status !== 200) {
      notification("Something went wrong... Please try again!", "error")
    }

    showReqNotif.current = true
  }

  // Handling updates coming from the backend
  function onMessage(e: MessageEvent) {
    const data: DataType = JSON.parse(e.data)

    if (data.live_game) {
      router.push(`/game/${data.live_game}`)
    }

    // If there are rejected requests
    // if (data.rejected_request && showRejNotif.current) {
    //   // Making sure we show the notifications only once
    //   showRejNotif.current = false

    //   // // Showing a notification
    //   // const msg = `${data.rejected_request.username} rejected your match request.`
    //   // notification(msg, "deleteRejected")
    // }

    // If there are game requests
    if (data.game_requests?.length! > 0 && showReqNotif.current) {
      // Making sure we show the notifications only once
      showReqNotif.current = false

      // Showing all game requests of a user
      data.game_requests?.map(user =>
        notification(
          `${user.username} wants to play with you.`,
          "accept-reject",
          false,
          () => accept(user.id),
          () => reject(user.id),
        ),
      )
    }
  }
}
