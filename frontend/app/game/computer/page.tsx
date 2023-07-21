"use client"

import getServerUrl from "@/components/utils/getServerUrl"
import gameWon from "@/game/checkers/utils/GameWon"
import sortCheckers from "@/game/checkers/utils/SortCheckers"
import updateStuff from "@/game/checkers/utils/UpdateStuff"
import { DEFAULT_CHECKER_POSITIONS } from "@/game/data/Data"
import { useGameStore } from "@/game/store/useGameStore"
import { UserCheckerType } from "@/game/types/Checker.type"
import { PlayerType } from "@/game/types/Game.type"
import lenRemovedCheckers from "@/game/utils/LenRemovedCheckers"
import switchPlayers from "@/game/utils/SwitchPlayers"
import axios from "axios"
import { getSession } from "next-auth/react"
import { useEffect } from "react"
import { shallow } from "zustand/shallow"

export default function VsComputer() {
  // Lock camera on the board
  useGameStore.subscribe(
    state => state.resetOrbit,
    resetOrbit => {
      resetOrbit?.("board", true)
    },
  )

  const players = useGameStore(state => state.players, shallow)
  const showThrow = useGameStore(state => state.showThrow)
  const dice = useGameStore(state => state.dice, shallow)
  const phase = useGameStore(state => state.phase)
  const userChecker = useGameStore(state => state.userChecker)

  // Update the checkers based on the prediction.
  function update(userChecker: UserCheckerType, move: string) {
    const copyCheckers = structuredClone(useGameStore.getState().checkers)

    // Setting the from position
    let fromPos = Number(move.split("/")[0])
    fromPos = fromPos === -1 || fromPos === -2 ? fromPos : fromPos - 1 // if we're bringing a checker off the bar, don't change fromPos

    // Setting the to position
    let toPos = Number(move.split("/")[1])
    toPos = toPos === -3 || toPos === -4 ? toPos : toPos - 1 // if we're bearing off, don't change toPos

    if (userChecker === "white") {
      if (fromPos !== -1) fromPos = 23 - fromPos
      if (toPos !== -3) toPos = 23 - toPos
    }

    // Settings the total moved number
    let moved: number
    if (fromPos === -1) moved = toPos + 1 // white brining off the bar
    else if (toPos === -3) moved = fromPos + 1 // white bearing off
    else if (fromPos === -2) moved = 24 - toPos // black brining off the bar
    else if (toPos === -4) moved = 24 - fromPos // black bearing off
    else moved = toPos - fromPos // normal move

    // If the computer is removing a checker
    const removedCheckers = copyCheckers.filter(c => c.col === toPos)
    if (removedCheckers.length === 1 && removedCheckers[0].color !== userChecker) {
      removedCheckers[0].removed = true
      removedCheckers[0].col = removedCheckers[0].color === "white" ? -1 : -2
      removedCheckers[0].row = lenRemovedCheckers(removedCheckers[0].color)
    }

    // Updating the single checker's column
    const checker = copyCheckers.filter(c => c.col === fromPos)[0]
    checker.col = toPos
    checker.removed = false

    useGameStore.setState({ checkers: copyCheckers })

    sortCheckers(fromPos)
    sortCheckers(toPos)
    updateStuff(moved, () => {}, false)

    if (gameWon(userChecker)) {
      useGameStore.setState({ phase: "ended", userChecker, inGame: false })
    }
  }

  // Get's the next best moves for the computer
  async function getPrediction() {
    type Data = { data: { moves: string[] | null } }

    const url = getServerUrl() + "/api/game/get-computer-prediction/"

    const context = {
      user_checker: userChecker,
      dice1: dice.dice1,
      dice2: dice.dice2,
      board: useGameStore.getState().checkers,
    }

    const { data }: Data = await axios.post(url, context)

    return data.moves
  }

  async function makeMove() {
    const moves = await getPrediction()

    // Something went wrong, perhaps the context was invalid.
    if (!moves) return

    // Updating the specified checkers by gnubg
    for (const move of moves) {
      update(userChecker!, move)
      // Little sleep function to make the animations look better
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  // Setting each player's info, game mode, checkers, dice, and phase.
  async function setInitialGameState() {
    const data = await getSession()

    const userChecker = Math.random() - 0.5 < 0 ? "white" : "black"
    const myColor = Math.random() - 0.5 < 0 ? "white" : "black"

    const me: PlayerType = {
      id: 0,
      name: data ? data.user.name : "Me",
      image: data ? data.user.image : "",
      color: myColor,
    }

    const enemy: PlayerType = {
      id: 1,
      name: "Computer",
      image: "",
      color: switchPlayers(myColor),
    }

    // Initializing the game
    useGameStore.setState({
      gameMode: "vs-computer",
      dice: { dice1: 0, dice2: 0, moves: 0 },
      userChecker,
      checkers: JSON.parse(JSON.stringify(DEFAULT_CHECKER_POSITIONS)),
      players: { me, enemy },
      phase: "initial",
      inGame: true,
    })
  }

  // Getting checker predictions
  useEffect(() => {
    // Checks to make sure it is the computer's turn
    if (phase !== "checkerMove" && phase !== "checkerMoveAgain") return
    if (dice.moves === 0 || userChecker !== players!.enemy.color) return

    makeMove()
  }, [phase])

  // Throwing dice, when it's the computer's turn
  useEffect(() => {
    if (!players || !showThrow) return

    if (useGameStore.getState().userChecker === players.enemy.color) {
      useGameStore.getState().throwDice?.()
    }
  }, [players, showThrow])

  // Initializing and ending states
  useEffect(() => {
    setInitialGameState()
    useGameStore.getState().resetOrbit?.("board", true)

    return () => {
      useGameStore.setState({ inGame: false, gameMode: undefined })
      useGameStore.getState().resetOrbit?.("env")
    }
  }, [])

  return <></>
}
