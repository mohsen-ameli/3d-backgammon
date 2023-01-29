import { useGLTF, OrbitControls } from "@react-three/drei"
import { createContext, useRef, useState } from "react"
import models from "../assets/models/models.glb"
import { Perf } from "r3f-perf"
import { Physics } from "@react-three/rapier"
import Dices from "./Dices"
import UI from "./UI"
import Checkers from "./Checkers"
import Board from "./Board"
import Columns from "./Columns"

// The grandious game state. This is where the magic is held in place.
export const GameState = createContext()

const Game = () => {
  // The current phase of the game
  const [phase, setPhase] = useState("initial")

  // Orbit controls enabled state
  const [orbitControlsEnabled, setOrbitControlsEnabled] = useState(true)

  // The numbers on the dice, and how many times the user is allowed to move
  // ex: [dice1: 2, dice2: 5, moves: 2] -> The dice shows 2 and 5, therefore the user can move twice
  // ex: [dice1: 6, dice2: 6, moves: 4] -> The dice shows 6 and 6, therefore the user can move four times
  const diceNums = useRef({ dice1: undefined, dice2: undefined, moves: 0 })

  // The current checker color that is being moved
  const userChecker = useRef("white")

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
  const checkers = useRef([
    { id: 0, color: "white", col: 21, row: 0, removed: false },
    { id: 1, color: "white", col: 21, row: 1, removed: false },
    { id: 2, color: "white", col: -3, row: 0, removed: false },
    { id: 3, color: "white", col: -3, row: 1, removed: false },
    { id: 4, color: "white", col: -3, row: 2, removed: false },
    { id: 5, color: "white", col: -3, row: 3, removed: false },
    { id: 6, color: "white", col: -3, row: 4, removed: false },
    { id: 7, color: "white", col: -3, row: 5, removed: false },
    { id: 8, color: "white", col: -3, row: 6, removed: false },
    { id: 9, color: "white", col: -3, row: 7, removed: false },
    { id: 10, color: "white", col: -3, row: 8, removed: false },
    { id: 11, color: "white", col: -3, row: 9, removed: false },
    { id: 12, color: "white", col: -3, row: 10, removed: false },
    { id: 13, color: "white", col: 18, row: 0, removed: false },
    { id: 14, color: "white", col: 18, row: 1, removed: false },

    { id: 15, color: "black", col: 23, row: 0, removed: false },
    { id: 16, color: "black", col: 23, row: 1, removed: false },
    { id: 17, color: "black", col: 12, row: 0, removed: false },
    { id: 18, color: "black", col: 12, row: 1, removed: false },
    { id: 19, color: "black", col: 12, row: 2, removed: false },
    { id: 20, color: "black", col: 12, row: 3, removed: false },
    { id: 21, color: "black", col: 12, row: 4, removed: false },
    { id: 22, color: "black", col: 7, row: 0, removed: false },
    { id: 23, color: "black", col: 7, row: 1, removed: false },
    { id: 24, color: "black", col: 7, row: 2, removed: false },
    { id: 25, color: "black", col: 5, row: 0, removed: false },
    { id: 26, color: "black", col: 5, row: 1, removed: false },
    { id: 27, color: "black", col: 5, row: 2, removed: false },
    { id: 28, color: "black", col: 5, row: 3, removed: false },
    { id: 29, color: "black", col: 5, row: 4, removed: false },
  ])

  // Load the models
  const { nodes, materials } = useGLTF(models)

  // Game state values
  const value = {
    nodes,
    materials,
    diceNums,
    userChecker,
    checkers,
    phase,
    setPhase,
    orbitControlsEnabled,
    setOrbitControlsEnabled,
    checkerPicked,
    newCheckerPosition,
  }

  return (
    <>
      <color args={["salmon"]} attach="background" />

      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 5]} intensity={1.5} />

      <Perf position="top-left" />

      <GameState.Provider value={value}>
        <OrbitControls makeDefault enabled={orbitControlsEnabled} />

        <UI />

        <Columns />

        <Physics>
          {/* <Debug /> */}

          <Dices />

          <Checkers />

          <Board />
        </Physics>
      </GameState.Provider>
    </>
  )
}

useGLTF.preload(models)

export default Game
