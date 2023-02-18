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
import userSwitch from "../assets/sounds/user-switch.mp3"

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
  const dice = useRef({ dice1: undefined, dice2: undefined, moves: 0 })

  // The current checker color that is being moved
  const userChecker = useRef()

  // If the checker has been picked up or not
  const checkerPicked = useRef(false)

  // The new position of the checker (in checkers used for calculating the moved variable)
  const newCheckerPosition = useRef()

  // Boolean to keep track of if it's the user's turn or not
  const [myTurn, setMyTurn] = useState(true)

  // Audio to play when users switch
  const [audio] = useState(() => new Audio(userSwitch))
  const playAudio = () =>
    audio.play().catch(() => {
      console.log(
        "Error playing audio, since user hasn't interacted with the website."
      )
    })

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

  // User has potentially entered the game
  useEffect(() => {
    if (!inGame) return

    // If the game mode is pass and play
    if (gameMode.current === "pass-and-play") {
      setPhase("initial")
      userChecker.current = Math.random() - 0.5 < 0 ? "white" : "black"
      checkers.current = JSON.parse(JSON.stringify(DEFAULT_CHECKER_POSITIONS))
    }

    // If the game mode is a "live game"
    if (gameMode.current.includes("game")) {
      const gameId = gameMode.current.split("_")[1]

      // Starting a websocket connection to let the fun begin
      setWs(() => new WebSocket(`ws://localhost:8000/ws/game/${gameId}/`))
    }
  }, [inGame])

  // Connecting to the backend (live game)
  useEffect(() => {
    if (!ws) return

    // Requesting initial data
    ws.onopen = () => ws.send(JSON.stringify({ initial: true }))

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data)

      // If there are too many sessions active
      if (data["too_many_users"]) {
        notification(
          "Please continue this game on your other active session!",
          "error"
        )
        return
      }

      // If game has ended
      if (data["finished"]) {
        userChecker.current = data["winner"]
        setPhase("ended")
        notification(`${toCapitalize(data["winner"])} is the winner!`)
        return
      }

      userChecker.current = data["turn"]
      checkers.current = data["board"]
      // dice.current = data["dice"]
      let turn = false

      // User is playing as white
      if (data.white === user.user_id && userChecker.current === "white") {
        turn = true
      }
      // Player is playing as black
      else if (data.black === user.user_id && userChecker.current === "black") {
        turn = true
      }

      setMyTurn(turn)

      // Setting the phase to initial
      if (data.initial) {
        setPhase("initial")
        return
      }

      // Go back into the backend, and comment some parts out.
      // Don't set the dice based on the information given from
      // the backend immidietly. For a little while, just send over
      // the dice to be saved in the DB, and later retrive it
      // and use it as the user's actual moves.

      // Return, if i am the user
      if (dice.current.moves !== 0) return

      // Making sure there is a rerender in the checkers component
      // so that both user's boards get updated
      setPhase((curr) => {
        if (curr === "diceRollAgain") {
          return "diceRoll"
        } else {
          return "diceRollAgain"
        }
      })
    }
  }, [ws])

  // Playing sound effect when the user changes (live game)
  useEffect(() => {
    if (!phase || phase === "initial") return
    playAudio()
  }, [myTurn])

  // Playing sound effect when the user changes (pass and play)
  useEffect(() => {
    if (
      gameMode.current === "pass-and-play" &&
      (phase === "diceRoll" || phase === "diceRollAgain")
    ) {
      playAudio()
    }
  }, [phase])

  // Game state values
  const value = {
    nodes,
    materials,
    dice,
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

      <Perf position="top-left" />

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
