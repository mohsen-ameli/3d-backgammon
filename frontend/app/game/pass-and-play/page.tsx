"use client"

import { useEffect } from "react"
import { useGameStore } from "@/game/store/useGameStore"
import { DEFAULT_CHECKER_POSITIONS } from "@/game/data/Data"
import switchPlayers from "@/game/utils/SwitchPlayers"
import { PlayerType } from "@/game/types/Game.type"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { randomNames } from "@/api/get-random-name/route"

/**
 * Pass and play game mode. User is playing with themselves (perhaps with someone else irl)
 */
export default function PassAndPlayPage() {
  useQuery({
    queryKey: ["random-name"],
    queryFn: async () => {
      const { data } = await axios.get("/api/get-random-name/")
      return data as randomNames
    },
    refetchOnWindowFocus: false,
    onSuccess: data => setGameState(data),
  })

  // Lock camera on the board
  useGameStore.subscribe(
    state => state.resetOrbit,
    resetOrbit => {
      resetOrbit?.("board", true)
    },
  )

  // Setting each player's info, game mode, checkers, dice, and phase.
  function setGameState(names: randomNames) {
    const userChecker = Math.random() - 0.5 < 0 ? "white" : "black"

    const me: PlayerType = {
      id: 0,
      name: names[0],
      image: "",
      color: userChecker,
    }

    const enemy: PlayerType = {
      id: 1,
      name: names[1],
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
  }

  useEffect(() => {
    useGameStore.getState().resetOrbit?.("board", true)

    return () => {
      useGameStore.setState({ inGame: false, gameMode: undefined })
      useGameStore.getState().resetOrbit?.("env")
    }
  }, [])

  return <></>
}
