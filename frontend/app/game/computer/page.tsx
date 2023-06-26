"use client"

import { DEFAULT_CHECKER_POSITIONS } from "@/game/data/Data"
import { useGameStore } from "@/game/store/useGameStore"
import { PlayerType } from "@/game/types/Game.type"
import switchPlayers from "@/game/utils/SwitchPlayers"
import { getSession } from "next-auth/react"
import { useEffect } from "react"

export default function VsComputer() {
  // Lock camera on the board
  useGameStore.subscribe(
    state => state.resetOrbit,
    resetOrbit => {
      resetOrbit?.("board", true)
    },
  )

  // Setting each player's info, game mode, checkers, dice, and phase.
  function setGameState() {
    getSession().then(data => {
      const userChecker = Math.random() - 0.5 < 0 ? "white" : "black"

      const me: PlayerType = {
        id: 0,
        name: "Me",
        image: data ? data.user.image : "",
        color: userChecker,
      }

      const enemy: PlayerType = {
        id: 1,
        name: "Computer",
        image: "",
        color: switchPlayers(userChecker),
      }

      useGameStore.setState({
        gameMode: "vs-computer",
        dice: { dice1: 0, dice2: 0, moves: 0 },
        userChecker,
        checkers: JSON.parse(JSON.stringify(DEFAULT_CHECKER_POSITIONS)),
        players: { me, enemy },
        phase: "initial",
        inGame: true,
      })
    })
  }

  useEffect(() => {
    setGameState()
    useGameStore.getState().resetOrbit?.("board", true)

    return () => {
      useGameStore.setState({ inGame: false, gameMode: undefined })
      useGameStore.getState().resetOrbit?.("env")
    }
  }, [])

  return <></>
}
