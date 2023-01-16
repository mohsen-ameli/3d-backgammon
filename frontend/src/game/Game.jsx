import { Clone, Html, OrbitControls, useGLTF } from "@react-three/drei"
import { useEffect, useMemo, useRef, useState } from "react"
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
import throwDice from "./utils/ThrowDice"
import { useFrame, useThree } from "@react-three/fiber"
import { useDrag } from "@use-gesture/react"
import { useSpring, a } from "@react-spring/three"
import Column from "./Column"
import Dice from "./Dice"

const TOTAL_CHECKERS = 8

const Game = () => {
  // const debug = useControls({
  //   x: { value: 0 },
  //   y: { value: 0.6 },
  //   z: { value: -1 },
  // })

  const columns = useRef()
  const dice1 = useRef()
  const dice2 = useRef()
  const checker = useRef()

  const { nodes, materials } = useGLTF(models)
  const [orbitControlsEnabled, setOrbitControlsEnabled] = useState(true)

  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width

  const [spring, set] = useSpring(() => ({
    position: [0, 0, 0],
    config: { mass: 1, friction: 40, tension: 800 },
  }))

  const bind = useDrag(({ offset: [x, y], down }) => {
    // setting the checkers x and z position (the user shouldn't have the ability to drag the checker upwards)
    const ground = -0.06
    const checkerX = x / aspect
    const checkerY = 0.2
    const checkerZ = y / aspect

    if (down) {
      // Disabling orbit controls when dragging
      orbitControlsEnabled && setOrbitControlsEnabled(false)
      // Setting the checker's position (Not the physics)
      set({ position: [checkerX, checkerY, checkerZ] })
    } else {
      setOrbitControlsEnabled(true)
      // Setting the checker's position (Not the physics)
      set({ position: [checkerX, ground, checkerZ] })

      // Setting the checker's physics position
      checker.current.setTranslation({
        x: checkerX,
        y: ground,
        z: checkerZ,
      })
    }
  })

  return (
    <>
      <OrbitControls makeDefault enabled={orbitControlsEnabled} />

      <color args={["salmon"]} attach="background" />

      <Perf position="top-left" />

      <Html as="div" transform scale={0.2} position={[1.75, 0.5, 0]}>
        <Button
          className="text-white"
          onClick={() => throwDice([dice1.current, dice2.current])}
        >
          Throw Dice
        </Button>
      </Html>

      {/* Columns */}
      <group name="Columns" ref={columns}>
        {Object.keys(nodes).map(
          (node, index) =>
            node.includes("col_") && (
              <Column
                obj={nodes[node]}
                nodes={nodes}
                materials={materials}
                key={index}
              />
            )
        )}
      </group>

      {/* Board Hinge */}
      <mesh geometry={nodes.Cube012_1.geometry} material={materials.Hinge} />

      <Physics>
        <Debug />

        {/* Dices */}
        <Dice
          ref={dice1}
          nodes={nodes}
          materials={materials}
          position={[0, 1, 2]}
        />
        <Dice
          ref={dice2}
          nodes={nodes}
          materials={materials}
          position={[0.1, 1, 2]}
        />

        {/* Dark Checker */}
        <RigidBody>
          <mesh
            name="DarkChecker"
            geometry={nodes.DarkChecker.geometry}
            material={materials.DarkCheckerMat}
            position={[0, 0.5, 0]}
          />
        </RigidBody>

        {/* White Checker */}
        <RigidBody ref={checker} type="kinematicPosition">
          <CuboidCollider args={[0.08, 0.02, 0.08]} position={[0, 0.02, 0]} />
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
          <CuboidCollider args={[1.175, 0.1, 0.935]} position={[0, -0.15, 0]} />
          {/* Center */}
          <CuboidCollider args={[0.07, 0.115, 1]} position={[0, 0, 0]} />
          {/* Left */}
          <CuboidCollider args={[0.07, 0.5, 1]} position={[-1.245, 0.06, 0]} />
          {/* Right */}
          <CuboidCollider args={[0.07, 0.5, 1]} position={[1.245, 0.06, 0]} />
          {/* Top */}
          <CuboidCollider args={[1.175, 0.5, 0.07]} position={[0, 0.06, -1]} />
          {/* Bottom */}
          <CuboidCollider args={[1.175, 0.5, 0.07]} position={[0, 0.06, 1]} />

          {/* Dice Holder */}
          <CuboidCollider args={[0.5, 0.1, 0.1]} position={[0, 0.6, 2]} />

          <mesh
            geometry={nodes.Cube012.geometry}
            material={materials.BoardWood2}
          />
        </RigidBody>
      </Physics>

      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 5]} intensity={1.5} />
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

    for (let i = 0; i < TOTAL_CHECKERS; i++) {
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
        args={[geometry, material, TOTAL_CHECKERS]}
      ></instancedMesh>
    </InstancedRigidBodies>
  )
}

export default Game
