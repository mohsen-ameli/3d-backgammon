"use client"

import { useEffect, useState } from "react"
import { useGameStore } from "@/game/store/useGameStore"
import { DEFAULT_CHECKER_POSITIONS } from "@/game/data/Data"
import { useSession } from "next-auth/react"
import AxiosInstance from "@/components/utils/AxiosInstance"
import switchPlayers from "@/game/utils/SwitchPlayers"
import { Session } from "next-auth"
import { PlayerType } from "@/game/types/Game.type"

type DataType = {
  data: [string, string]
}

/**
 * Pass and play game mode. User is playing with themselves (perhaps with someone else irl)
 */
export default function PassAndPlayPage() {
  // Lock camera on the board
  useGameStore.subscribe(
    state => state.resetOrbit,
    resetOrbit => {
      resetOrbit?.("board", true)
    },
  )

  const { data: session } = useSession()

  const [data, setData] = useState<[string, string] | null>(null)

  // Setting each player's info, game mode, checkers, dice, and phase.
  useEffect(() => {
    useGameStore.getState().resetOrbit?.("board", true)

    const userChecker = Math.random() - 0.5 < 0 ? "white" : "black"

    const me: PlayerType = {
      id: 0,
      name: data ? data[0] : "Guest",
      image: "",
      color: userChecker,
    }

    const enemy: PlayerType = {
      id: 1,
      name: data ? data[1] : "Guest",
      image: "",
      color: switchPlayers(userChecker),
    }

    useGameStore.setState({
      gameMode: "pass-and-play",
      dice: { dice1: 0, dice2: 0, moves: 0 },
      userChecker,
      checkers: JSON.parse(JSON.stringify(DEFAULT_CHECKER_POSITIONS)),
      players: { me, enemy },
      phase: "initial",
      inGame: true,
    })
  }, [data])

  // Resetting states when user leaves the game.
  useEffect(() => {
    getRandomName(session)
  }, [session])

  useEffect(() => {
    return () => {
      useGameStore.setState({ inGame: false, gameMode: undefined })
      useGameStore.getState().resetOrbit?.("env")
    }
  }, [])

  // Gets two random names for the users
  async function getRandomName(session: Session | null) {
    if (!session) {
      setData(["Guest", "Guest"])
      return
    }
    const axiosInstance = AxiosInstance(session)

    try {
      const { data: d }: DataType = await axiosInstance.get("/api/game/get-random-name/")
      setData(d)
    } catch (e) {
      setData(["Guest", "Guest"])
    }
  }

  return <></>
}
