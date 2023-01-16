import { Clone, Html, OrbitControls, useGLTF } from "@react-three/drei"
import { createContext, useEffect, useMemo, useRef, useState } from "react"
import models from "../assets/models/models.glb"
import { Perf } from "r3f-perf"
import * as THREE from "three"
import Button from "../components/ui/Button"
import {
  CuboidCollider,
  Debug,
  InstancedRigidBodies,
  Physics,
  RigidBody,
} from "@react-three/rapier"
import { useControls } from "leva"
import throwDices from "./utils/ThrowDices"
import { useFrame, useThree } from "@react-three/fiber"
import { useDrag } from "@use-gesture/react"
import { useSpring, a } from "@react-spring/three"
import Column from "./Column"
import Dice from "./Dice"
import * as data from "./data/Data"
import resetDices from "./utils/ResetDices"

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
  const dice1 = useRef()
  const dice2 = useRef()
  const checker = useRef()
  const userTurn = useRef("white")
  const checkerPicked = useRef(false)
  const newCheckerPosition = useRef()

  // const checkerPositions = useRef({
  //   1: 2,
  // })

  // A game state that will have all the checker's positions
  const [checkerPos, setCheckerPos] = useState({
    1: [0, 4],
  })

  const { nodes, materials } = useGLTF(models)
  const [orbitControlsEnabled, setOrbitControlsEnabled] = useState(true)

  // Checkers
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width

  // Values to move the checkers around
  const xAxis = 0.155
  const xStep = 0.1835
  const rightEnd = xAxis + xStep * 5
  const zAxis = 0.855
  const zStep = 0.165

  console.log("first")

  // local state for every checker
  // const [pos, setPos] = useState(() => {
  //   const checkerNum = 1
  //   let zValues

  //   // Upper rank (z-axis)
  //   if (checkerNum <= 11) {
  //     zValues = -zAxis
  //   }
  //   // Lower rank (z-axis)
  //   else {
  //     zValues = zAxis
  //   }

  //   // Right side
  //   if (checkerPos[checkerNum][0] <= 6) {
  //     return [
  //       rightEnd - xStep * checkerPos[checkerNum][0],
  //       -0.03,
  //       zValues - zStep * checkerPos[checkerNum][1],
  //     ]
  //   }
  //   // Left side
  //   else {
  //     return [
  //       rightEnd - xStep * checkerPos[checkerNum][0],
  //       -0.03,
  //       zValues - zStep * checkerPos[checkerNum][1],
  //     ]
  //   }
  // })

  const pos = [1, -0.03, 0]

  // useEffect(() => {
  //   if (checkerPos[1] <= 6 || checkerPos[1] >= 19) {
  //     setPos([rightEnd - xStep * checkerPos[1], -0.03, -zAxis + zStep * 3])
  //   }
  // }, [checkerPos])

  const [spring, set] = useSpring(() => ({
    position: pos,
    config: { mass: 1, friction: 40, tension: 800 },
  }))

  // When a checker is picked up (dragged)
  const bind = useDrag(
    ({ offset: [x, y], dragging }) => {
      // Ground level (y coordinate)
      const ground = -0.05
      // Used for dragging the checker in the x, y, z directions
      const checkerX = x / aspect
      const checkerY = 0.2
      const checkerZ = y / aspect

      // Started dragging the checker
      if (dragging) {
        // Disabling orbit controls
        orbitControlsEnabled && setOrbitControlsEnabled(false)

        // Setting the checker's mesh position (not the physics)
        set({ position: [checkerX, checkerY, checkerZ] })

        checkerPicked.current = true
      }
      // Finished dragging
      else {
        setOrbitControlsEnabled(true)

        // *1: Get the column number
        // 2: Get the from and to, column numbers
        // 3: Check how many columns they have moved
        // 4: If the dice number matches with step 1, then proceed
        // if not, then show error message
        // 5: Call a function that will get the number of checker
        // on that column and give out a set of coordinates for
        // the new checker to placed on.

        checkerPicked.current = false

        // Setting the checker's mesh position (not the physics)
        set({ position: [checkerX, ground, checkerZ] })

        // Setting the checker's physics position
        checker.current.setTranslation({
          x: checkerX,
          y: ground + 0.01,
          z: checkerZ,
        })
      }
    },
    {
      // From position of the checker
      from: () => {
        return [
          spring.position.get()[0] * aspect,
          spring.position.get()[2] * aspect,
        ]
      },
    }
  )

  // Game state values
  const value = {
    nodes,
    materials,
    orbitControlsEnabled,
    setOrbitControlsEnabled,
    userTurn,
    checkerPicked,
    newCheckerPosition,
  }

  return (
    <>
      <OrbitControls makeDefault enabled={orbitControlsEnabled} />

      <color args={["salmon"]} attach="background" />

      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 5]} intensity={1.5} />

      <Perf position="top-left" />

      <GameState.Provider value={value}>
        {/* UI components around the board */}
        <Html as="div" transform scale={0.2} position={[1.75, 0.5, 0]}>
          {/* Throwing the dice */}
          <Button
            className="text-white select-none"
            onClick={() => {
              resetDices([dice1.current, dice2.current])
              throwDices([dice1.current, dice2.current])
            }}
          >
            Throw Dice
          </Button>

          {/* Flipping the board */}
          <Button
            className="text-white select-none"
            onClick={() => {
              userTurn.current =
                userTurn.current === "white" ? "black" : "white"
              // Fire a function to flip the board
              // board.current.rotation.y = board.current.rotation.y + Math.PI
            }}
          >
            Flip the board
          </Button>
        </Html>

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
          <Dice ref={dice1} position={data.DICE_1_DEFAULT_POS} />
          <Dice ref={dice2} position={data.DICE_2_DEFAULT_POS} />

          {/* Dark Checker */}
          {/* <RigidBody>
          <mesh
            name="DarkChecker"
            geometry={nodes.DarkChecker.geometry}
            material={materials.DarkCheckerMat}
            position={[0, 0.5, 0]}
          />
        </RigidBody> */}

          {/* White Checkers */}
          <RigidBody ref={checker} type="kinematicPosition" position={pos}>
            <CuboidCollider args={[0.08, 0.02, 0.08]} />
          </RigidBody>
          <a.mesh
            {...spring}
            {...bind()}
            name="WhiteChecker"
            geometry={nodes.WhiteChecker.geometry}
            material={materials.WhiteCheckerMat}
          />

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

const WhiteCheckers = ({ geometry, material }) => {
  const COL_STEP = 0.16

  const EDGE_X = 1.08
  const EDGE_Z = 0.85

  const DROP_HEIGHT_Y = 0.2
  const CHECKER_WIDTH = 0.15

  const cubesTransforms = useMemo(() => {
    const positions = []
    const rotaions = []
    const scales = []

    positions[0] = [EDGE_X, DROP_HEIGHT_Y, -EDGE_Z]
    positions[1] = [EDGE_X, DROP_HEIGHT_Y, -EDGE_Z + CHECKER_WIDTH]

    positions[2] = [-EDGE_X, DROP_HEIGHT_Y, -EDGE_Z + CHECKER_WIDTH * 0]
    positions[3] = [-EDGE_X, DROP_HEIGHT_Y, -EDGE_Z + CHECKER_WIDTH * 1]
    positions[4] = [-EDGE_X, DROP_HEIGHT_Y, -EDGE_Z + CHECKER_WIDTH * 2]
    positions[5] = [-EDGE_X, DROP_HEIGHT_Y, -EDGE_Z + CHECKER_WIDTH * 3]
    positions[6] = [-EDGE_X, DROP_HEIGHT_Y, -EDGE_Z + CHECKER_WIDTH * 4]

    positions[7] = [EDGE_X / 4, DROP_HEIGHT_Y, -EDGE_Z + CHECKER_WIDTH * 4]
    // positions[8] = [-EDGE_X, DROP_HEIGHT_Y, -EDGE_Z + CHECKER_WIDTH * 4]
    // positions[9] = [-EDGE_X, DROP_HEIGHT_Y, -EDGE_Z + CHECKER_WIDTH * 4]

    for (let i = 0; i < data.TOTAL_CHECKERS; i++) {
      // positions.push([-i, 0, 0])
      rotaions.push([0, 0, 0])
      scales.push([1, 1, 1])
    }

    return { positions, rotaions, scales }
  }, [])

  return (
    <InstancedRigidBodies
      positions={cubesTransforms.positions}
      rotations={cubesTransforms.rotaions}
      scales={cubesTransforms.scales}
    >
      <instancedMesh
        args={[geometry, material, data.TOTAL_CHECKERS]}
      ></instancedMesh>
    </InstancedRigidBodies>
  )
}

export default Game
