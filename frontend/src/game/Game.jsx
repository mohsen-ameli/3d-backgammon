import { useGLTF, OrbitControls } from "@react-three/drei"
import { createContext, useEffect, useRef, useState } from "react"
import models from "../assets/models/models.glb"
import { Perf } from "r3f-perf"
import * as THREE from "three"
import { Physics } from "@react-three/rapier"
import { useControls } from "leva"
import Dices from "./Dices"
import UI from "./UI"
import Checkers from "./Checkers"
import Board from "./Board"
import Columns from "./Columns"

// The grandious game state. This is where the magic is held in place.
export const GameState = createContext()

const Game = () => {
  // const debug = useControls({
  //   x: { value: 0 },
  //   y: { value: 0.6 },
  //   z: { value: 0.855, step: 0.0001 },
  // })

  // The numbers on the dice, and how many times the user is allowed to move
  // ex: [2, 5, 2] -> The dice shows 2 and 5 and therefore user can move twice
  // ex: [6, 6, 4] -> The dice shows 6 and 6 and therefore user can move four times
  const diceNums = useRef({ dice1: undefined, dice2: undefined, moves: 0 })
  // The current checker that is being moved
  const userChecker = useRef("white")
  // If the checker has been picked up
  const checkerPicked = useRef(false)
  // The new position of the checker (in checkers used for calculating the moved variable)
  const newCheckerPosition = useRef()

  // The current phase of the game
  const [phase, setPhase] = useState("initial")
  // Orbit controls state
  const [orbitControlsEnabled, setOrbitControlsEnabled] = useState(true)

  /* checkerNumber: [
    id: int,
    color: "white" | "black",
    col: 0 - 23 (if removed, -1 => white checkers or -2 => black checkers),
    row: 0 - 4,
    removed: true | false
  ] */

  // All of the checkers' default positions
  const checkers = useRef([
    { id: 0, color: "white", col: 0, row: 0, removed: false },
    { id: 1, color: "white", col: 0, row: 1, removed: false },
    { id: 2, color: "white", col: 11, row: 0, removed: false },
    { id: 3, color: "white", col: 11, row: 1, removed: false },
    { id: 4, color: "white", col: 11, row: 2, removed: false },
    { id: 5, color: "white", col: 11, row: 3, removed: false },
    { id: 6, color: "white", col: 11, row: 4, removed: false },
    { id: 7, color: "white", col: 16, row: 0, removed: false },
    { id: 8, color: "white", col: 16, row: 1, removed: false },
    { id: 9, color: "white", col: 16, row: 2, removed: false },
    { id: 10, color: "white", col: 18, row: 0, removed: false },
    { id: 11, color: "white", col: 18, row: 1, removed: false },
    { id: 12, color: "white", col: 18, row: 2, removed: false },
    { id: 13, color: "white", col: 18, row: 3, removed: false },
    { id: 14, color: "white", col: 18, row: 4, removed: false },

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

  useEffect(() => console.log("rerendering main game state"))

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
