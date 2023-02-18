import { useGLTF, Environment } from "@react-three/drei"
import { createContext, useContext, useRef, useState } from "react"
import models from "../assets/models/models.glb"
import { Perf } from "r3f-perf"
import { Debug, Physics } from "@react-three/rapier"
import Dices from "./Dices"
import UI from "./UI"
import Checkers from "./Checkers"
import Board from "./Board"
import Columns from "./Columns"
import { useEffect } from "react"
import { DEFAULT_CHECKER_POSITIONS } from "./data/Data"
import { AuthContext } from "../context/AuthContext"
import notification from "../components/utils/Notification"
import toCapitalize from "../components/utils/ToCapitalize"
import Controls from "./Controls"

// The grandious game state. This is where the magic is held in place.
export const GameState = createContext()

const Game = () => {
  const { user, inGame, gameMode } = useContext(AuthContext)

  // The current phase of the game
  const [phase, setPhase] = useState()

  // Game websocket
  const [ws, setWs] = useState(() => {})

  // Orbit control
  const resetOrbit = useRef(() => null)
  const toggleControls = useRef(() => null)
  const orbitRef = useRef()

  // The numbers on the dice, and how many times the user is allowed to move
  // ex: [dice1: 2, dice2: 5, moves: 2] -> The dice shows 2 and 5, therefore the user can move twice
  // ex: [dice1: 6, dice2: 6, moves: 4] -> The dice shows 6 and 6, therefore the user can move four times
  const diceNums = useRef({ dice1: undefined, dice2: undefined, moves: 0 })

  // The current checker color that is being moved
  const userChecker = useRef()

  // If the checker has been picked up or not
  const checkerPicked = useRef(false)

  // The new position of the checker (in checkers used for calculating the moved variable)
  const newCheckerPosition = useRef()

  // Boolean to keep track of if it's the user's turn or not
  const myTurn = useRef(true)

  /* checkers: [
    id: int,
    color: str = "white" | "black",
    col: int = 0-23 normal | -1 removed white checker | -2 removed black checker | -3 endbar white checker | -4 endbar black checker,
    row: int = 0 - 4,
    removed: Boolean
  ] */

  // All of the checkers' default positions
  const checkers = useRef([])

  // Load the models
  const { nodes, materials } = useGLTF(models)

  // User has entered the game (potentially)
  useEffect(() => {
    if (!inGame) return

    if (gameMode.current === "pass-and-play") {
      setPhase("initial")
      userChecker.current = Math.random() - 0.5 < 0 ? "white" : "black"
      checkers.current = JSON.parse(JSON.stringify(DEFAULT_CHECKER_POSITIONS))
    }

    if (gameMode.current.includes("game")) {
      const gameId = gameMode.current.split("_")[1]

      // Starting a websocket connection to let the fun begin
      setWs(() => new WebSocket(`ws://localhost:8000/ws/game/${gameId}/`))
    }
  }, [inGame])

  useEffect(() => {
    if (!ws) return

    ws.onopen = () => {
      ws.send(JSON.stringify({ initial: true }))
    }

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data)

      // Checking if the user has multiple sessions active
      if (data["too_many_users"]) {
        notification(
          "Please continue this game on your other active session!",
          "error"
        )
        return
      }

      if (data["finished"]) {
        userChecker.current = data["winner"]
        setPhase("ended")
        notification(`${toCapitalize(data["winner"])} is the winner!`)
        return
      }

      userChecker.current = data["turn"]
      checkers.current = data["board"]
      myTurn.current = false

      // User is playing as white
      if (data.white === user.user_id && userChecker.current === "white") {
        myTurn.current = true
      }
      // Player is playing as black
      else if (data.black === user.user_id && userChecker.current === "black") {
        myTurn.current = true
      }

      if (data.initial) {
        setPhase("initial")
      } else {
        setPhase((curr) => {
          if (curr === "diceRollAgain") {
            return "diceRoll"
          } else {
            return "diceRollAgain"
          }
        })
      }
    }
  }, [ws])

  // Game state values
  const value = {
    nodes,
    materials,
    diceNums,
    userChecker,
    myTurn,
    checkers,
    checkerPicked,
    newCheckerPosition,
    ws,
    phase,
    setPhase,
    toggleControls,
    resetOrbit,
  }

  return (
    <>
      <Environment preset="forest" background blur={0.1} />

      <ambientLight intensity={1} />
      <directionalLight position={[-5, 10, 5]} intensity={0.5} />

      {/* <Perf position="top-left" /> */}

      <GameState.Provider value={value}>
        <Controls ref={orbitRef} />

        <UI />

        <Columns />

        <Physics>
          {/* <Debug /> */}

          <Board />

          {inGame && <Dices />}
          {inGame && <Checkers />}
        </Physics>
      </GameState.Provider>
    </>
  )
}

useGLTF.preload(models)

export default Game
