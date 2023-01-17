import { Html, useGLTF } from "@react-three/drei"
import { createContext, useEffect, useMemo, useRef, useState } from "react"
import models from "../assets/models/models.glb"
import { Perf } from "r3f-perf"
import * as THREE from "three"
import Button from "../components/ui/Button"
import { CuboidCollider, Debug, Physics, RigidBody } from "@react-three/rapier"
import { useControls } from "leva"
import Column from "./Column"
import * as data from "./data/Data"
import Checker from "./Checker"
import OrbitProvider from "./OrbitContext"
import Dices from "./Dices"
import UI from "./UI"

// The grandious game state. This is where the magic is held in place.
export const GameState = createContext()

const Game = () => {
  // const debug = useControls({
  //   x: { value: 0 },
  //   y: { value: 0.6 },
  //   z: { value: 0.855, step: 0.0001 },
  // })

  const board = useRef()
  const columns = useRef()
  const diceNums = useRef([])

  const userTurn = useRef("white")
  const checkerPicked = useRef(false)
  const newCheckerPosition = useRef()

  /* checkerNumber: [
    id,
    color: "white" | "black",
    col: 0 - 23,
    row: 0 - 4,
  ] */

  const checkers = useRef([
    { id: 0, color: "white", col: 0, row: 0 },
    { id: 1, color: "white", col: 0, row: 1 },
    { id: 2, color: "white", col: 11, row: 0 },
    { id: 3, color: "white", col: 11, row: 1 },
    { id: 4, color: "white", col: 11, row: 2 },
    { id: 5, color: "white", col: 11, row: 3 },
    { id: 6, color: "white", col: 11, row: 4 },
    { id: 7, color: "white", col: 16, row: 0 },
    { id: 8, color: "white", col: 16, row: 1 },
    { id: 9, color: "white", col: 16, row: 2 },
    { id: 10, color: "white", col: 18, row: 0 },
    { id: 11, color: "white", col: 18, row: 1 },
    { id: 12, color: "white", col: 18, row: 2 },
    { id: 13, color: "white", col: 18, row: 3 },
    { id: 14, color: "white", col: 18, row: 4 },

    { id: 15, color: "black", col: 23, row: 0 },
    { id: 16, color: "black", col: 23, row: 1 },
    { id: 17, color: "black", col: 12, row: 0 },
    { id: 18, color: "black", col: 12, row: 1 },
    { id: 19, color: "black", col: 12, row: 2 },
    { id: 20, color: "black", col: 12, row: 3 },
    { id: 21, color: "black", col: 12, row: 4 },
    { id: 22, color: "black", col: 7, row: 0 },
    { id: 23, color: "black", col: 7, row: 1 },
    { id: 24, color: "black", col: 7, row: 2 },
    { id: 25, color: "black", col: 5, row: 0 },
    { id: 26, color: "black", col: 5, row: 1 },
    { id: 27, color: "black", col: 5, row: 2 },
    { id: 28, color: "black", col: 5, row: 3 },
    { id: 29, color: "black", col: 5, row: 4 },
  ])

  // A game state that will have all the checker's positions
  // const [checkerPos, setCheckerPos] = useState({
  //   1: [0, 4],
  // })

  useEffect(() => console.log("rerendering main game state"))

  const { nodes, materials } = useGLTF(models)

  // Game state values
  const value = {
    nodes,
    materials,
    diceNums,
    userTurn,
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
        {/* UI components around the board */}
        <UI />

        {/* Columns */}
        <group name="Columns" ref={columns}>
          {Object.keys(nodes).map(
            (node, index) =>
              node.includes("col_") && <Column node={node} key={index} />
          )}
        </group>

        {/* Board Hinge */}
        <mesh geometry={nodes.Cube012_1.geometry} material={materials.Hinge} />

        <Physics>
          <Debug />

          {/* Dices */}
          <Dices />

          {/* Checkers */}
          <OrbitProvider>
            {checkers.current.map((data) => (
              <Checker info={data} key={data.id} />
            ))}
          </OrbitProvider>

          {/* Board */}
          <RigidBody type="fixed" colliders={false}>
            {/* Surface */}
            <CuboidCollider
              args={[1.175, 0.1, 0.935]}
              position={[0, -0.15, 0]}
            />

            {/* Center */}
            <CuboidCollider args={[0.07, 0.115, 1]} position={[0, 0, 0]} />

            {/* Left */}
            <CuboidCollider
              args={[0.07, 0.5, 1]}
              position={[-1.245, 0.06, 0]}
            />

            {/* Right */}
            <CuboidCollider args={[0.07, 0.5, 1]} position={[1.245, 0.06, 0]} />

            {/* Top */}
            <CuboidCollider
              args={[1.175, 0.5, 0.07]}
              position={[0, 0.06, -1]}
            />

            {/* Bottom */}
            <CuboidCollider args={[1.175, 0.5, 0.07]} position={[0, 0.06, 1]} />

            {/* Dice Holder */}
            <CuboidCollider args={[0.5, 0.1, 0.1]} position={[0, 0.6, 2]} />

            <mesh
              geometry={nodes.Cube012.geometry}
              material={materials.BoardWood2}
              ref={board}
            />
          </RigidBody>
        </Physics>
      </GameState.Provider>
    </>
  )
}

export default Game
