"use client"

import { BaseUser } from "@/types/User.type"
import { useEffect, useRef, useState } from "react"
import notification from "../../components/utils/Notification"
import AxiosInstance from "../../components/utils/AxiosInstance"
import { getSession, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useGameStore } from "@/game/store/useGameStore"
import getServerUrl from "../../components/utils/getServerUrl"
import axios from "axios"

type DataType = {
  live_game?: string
  game_requests?: BaseUser[]
}

export default function useStatus() {
  const inGame = useGameStore(state => state.inGame)
  const router = useRouter()
  const { data: session, update } = useSession()
  const axiosInstance = AxiosInstance(session!)

  const [ws, setWs] = useState<WebSocket | null>(null)

  // Needed for game request notifications
  const showReqNotif = useRef(true)
  const showRejNotif = useRef(true)

  // Starting a websocket connection
  useEffect(() => {
    if (!session || ws) return

    const url = `${getServerUrl(false)}/ws/status/${session.user.id}/`
    setWs(() => new WebSocket(url))
  }, [session])

  // Setting up websocket event listeners
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

  useEffect(() => {
    isUserPremium()
  }, [])

  // Updating the premium status of the current user
  async function isUserPremium() {
    const session = await getSession()
    if (!session) return
    const { data }: { data: boolean } = await axios.get("/api/stripe")
    await update({ ...session, user: { ...session?.user, premium: data } })
  }

  // Accepting a game request
  async function accept(id: number) {
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

  // Rejecting a game request
  async function reject(id: number) {
    const res = await axiosInstance.put("/api/game/handle-match-request/", {
      action: "reject",
      friend_id: id,
    })

    if (res.status !== 200) {
      notification("Something went wrong... Please try again!", "error")
    }

    showReqNotif.current = true
  }

  // Handling incoming updates from the backend
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
