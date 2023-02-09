import { useGLTF, OrbitControls, Environment } from "@react-three/drei"
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
import { useLocation } from "react-router-dom"
import { DEFAULT_CHECKER_POSITIONS } from "./data/Data"
import { AuthContext } from "../context/AuthContext"

// The grandious game state. This is where the magic is held in place.
export const GameState = createContext()

const Game = () => {
  const { inGame, gameMode } = useContext(AuthContext)

  // The current phase of the game
  const [phase, setPhase] = useState()

  // Orbit controls enabled state
  const [orbitControls, setOrbitControls] = useState({
    enabled: true,
    changable: true,
  })

  // Toggle the orbit controls.
  const toggleControls = (ui = false) => {
    let returnValue
    if (ui) {
      returnValue = {
        enabled: !orbitControls["enabled"],
        changable: !orbitControls["changable"],
      }
    } else if (orbitControls["changable"]) {
      returnValue = {
        enabled: !orbitControls["enabled"],
        changable: orbitControls["changable"],
      }
    }

    if (!returnValue) return
    setOrbitControls(returnValue)
  }

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

  /* checkerNumber: [
    id: int,
    color: "white" | "black",
    col: 0-23 normal, -1 removed white checker, -2 removed black checker, -3 endbar white checker, -4 endbar black checker,
    row: 0 - 4,
    removed: true | false
  ] */

  // All of the checkers' default positions
  const checkers = useRef(JSON.parse(JSON.stringify(DEFAULT_CHECKER_POSITIONS)))

  // Load the models
  const { nodes, materials } = useGLTF(models)

  const location = useLocation()

  // Setting the phase to initial if user is playing
  useEffect(() => {
    // This will not work when a user accepts a match request. Because
    // of the validation fetch request.
    if (!inGame) return

    // if (gameMode.current === "pass-and-play") {
    setPhase("initial")
    userChecker.current = Math.random() - 0.5 < 0 ? "white" : "black"
    checkers.current = JSON.parse(JSON.stringify(DEFAULT_CHECKER_POSITIONS))
    // }
  }, [inGame])

  // Game state values
  const value = {
    nodes,
    materials,
    diceNums,
    userChecker,
    checkers,
    checkerPicked,
    newCheckerPosition,
    phase,
    setPhase,
    orbitControls,
    toggleControls,
  }

  return (
    <>
      <Environment preset="forest" background blur={0.1} />

      <ambientLight intensity={1} />
      <directionalLight position={[-5, 10, 5]} intensity={0.5} />

      <Perf position="top-left" />

      <GameState.Provider value={value}>
        <OrbitControls makeDefault enabled={orbitControls["enabled"]} />

        <UI />

        <Columns />

        <Physics>
          {/* <Debug /> */}

          {inGame && (
            <>
              <Dices />

              <Checkers />
            </>
          )}
          <Board />
        </Physics>
      </GameState.Provider>
    </>
  )
}

useGLTF.preload(models)

export default Game
