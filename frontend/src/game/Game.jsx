import { Clone, Html, OrbitControls, useGLTF } from "@react-three/drei"
import { forwardRef, useEffect, useMemo, useRef, useState } from "react"
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
import getDiceNumber from "./utils/GetDiceNumber"
import throwDice from "./utils/ThrowDice"
import { useFrame, useThree } from "@react-three/fiber"
import { useDrag } from "@use-gesture/react"
import { useSpring, a } from "@react-spring/three"

let OriginalWhiteColumnColor = new THREE.Color()

const WhiteColumnMat = new THREE.MeshStandardMaterial()
const DarkColumnMat = new THREE.MeshStandardMaterial()

const DICE_MASS = 0.2
const DICE_BOUNCINESS = 0.9
const DICE_FRICTION = 0.4
const TOTAL_CHECKERS = 8

const Game = () => {
  // const debug = useControls({
  //   x: { value: 0 },
  //   y: { value: 0.6 },
  //   z: { value: -1 },
  // })

  const first = useRef()
  const dice = useRef()
  const dice2 = useRef()
  const ref = useRef()
  const checker = useRef()
  const { nodes, materials } = useGLTF(models)
  const [myTurn, setMyTurn] = useState(false)
  const [orbitControlsEnabled, setOrbitControlsEnabled] = useState(true)

  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width

  const [spring, set] = useSpring(() => ({
    position: [0, 0, 0],
    config: { mass: 1, friction: 40, tension: 1200 },
  }))

  const bind = useDrag(({ offset: [x, y], down }) => {
    // set({ position: [x / aspect, 0, y / aspect] })

    // setting the checkers x and z position (the user shouldn't have the ability to drag the checker upwards)
    const checkerX = x / aspect
    const ground = -0.06
    const checkerY = 0.2
    const checkerZ = y / aspect

    checker.current.setTranslation({ x: checkerX, y: checkerY, z: checkerZ })

    if (down) {
      // Disabling orbit controls when dragging
      orbitControlsEnabled && setOrbitControlsEnabled(false)
    } else {
      setOrbitControlsEnabled(true)
      // console.log(checker.current?.mass())
      // checker.current?.setMass(10)
      checker.current.setTranslation({ x: checkerX, y: ground, z: checkerZ })
    }
  })

  useEffect(() => {
    // Optimizing the triangle columns inside the board
    WhiteColumnMat.copy(materials.ColumnWhite)
    OriginalWhiteColumnColor.copy(WhiteColumnMat.color)
    DarkColumnMat.copy(materials.ColumnDark)
  }, [])

  return (
    <>
      <OrbitControls makeDefault enabled={orbitControlsEnabled} />

      <color args={["salmon"]} attach="background" />

      <Perf position="top-left" />

      <Html as="div" transform scale={0.2} position={[1.75, 0.5, 0]}>
        <Button
          className="text-white"
          onClick={() => throwDice([dice.current, dice2.current])}
        >
          Throw Dice
        </Button>
      </Html>

      {/* Columns */}
      <group name="Top">
        <mesh
          position={nodes["1"].position}
          geometry={nodes["1"].geometry}
          material={DarkColumnMat}
          ref={first}
        />
        <mesh
          position={nodes["2"].position}
          geometry={nodes["1"].geometry}
          material={WhiteColumnMat}
        />
        <mesh
          position={nodes["3"].position}
          geometry={nodes["1"].geometry}
          material={DarkColumnMat}
        />
        <mesh
          position={nodes["4"].position}
          geometry={nodes["1"].geometry}
          material={WhiteColumnMat}
        />
        <mesh
          position={nodes["5"].position}
          geometry={nodes["1"].geometry}
          material={DarkColumnMat}
        />
        <mesh
          position={nodes["6"].position}
          geometry={nodes["1"].geometry}
          material={WhiteColumnMat}
        />
        <mesh
          position={nodes["7"].position}
          geometry={nodes["1"].geometry}
          material={DarkColumnMat}
        />
        <mesh
          position={nodes["8"].position}
          geometry={nodes["1"].geometry}
          material={WhiteColumnMat}
        />
        <mesh
          position={nodes["9"].position}
          geometry={nodes["1"].geometry}
          material={DarkColumnMat}
        />
        <mesh
          position={nodes["10"].position}
          geometry={nodes["1"].geometry}
          material={WhiteColumnMat}
        />
        <mesh
          position={nodes["11"].position}
          geometry={nodes["1"].geometry}
          material={DarkColumnMat}
        />
        <mesh
          onPointerEnter={() => nodes["12"].material.color.set("white")}
          onPointerLeave={() =>
            nodes["12"].material.color.set(OriginalWhiteColumnColor)
          }
          position={nodes["12"].position}
          geometry={nodes["1"].geometry}
          material={nodes["12"].material}
        />
      </group>
      <group name="Bottom">
        <mesh
          position={nodes["13"].position}
          geometry={nodes["24"].geometry}
          material={DarkColumnMat}
        />
        <mesh
          position={nodes["14"].position}
          geometry={nodes["24"].geometry}
          material={WhiteColumnMat}
        />
        <mesh
          position={nodes["15"].position}
          geometry={nodes["24"].geometry}
          material={DarkColumnMat}
        />
        <mesh
          position={nodes["16"].position}
          geometry={nodes["24"].geometry}
          material={WhiteColumnMat}
        />
        <mesh
          position={nodes["17"].position}
          geometry={nodes["24"].geometry}
          material={DarkColumnMat}
        />
        <mesh
          position={nodes["18"].position}
          geometry={nodes["24"].geometry}
          material={WhiteColumnMat}
        />
        <mesh
          position={nodes["19"].position}
          geometry={nodes["24"].geometry}
          material={DarkColumnMat}
        />
        <mesh
          position={nodes["20"].position}
          geometry={nodes["24"].geometry}
          material={WhiteColumnMat}
        />
        <mesh
          position={nodes["21"].position}
          geometry={nodes["24"].geometry}
          material={DarkColumnMat}
        />
        <mesh
          position={nodes["22"].position}
          geometry={nodes["24"].geometry}
          material={WhiteColumnMat}
        />
        <mesh
          position={nodes["23"].position}
          geometry={nodes["24"].geometry}
          material={DarkColumnMat}
        />
        <mesh
          position={nodes["24"].position}
          geometry={nodes["24"].geometry}
          material={WhiteColumnMat}
        />
      </group>

      {/* Board Hinge */}
      <mesh geometry={nodes.Cube012_1.geometry} material={materials.Hinge} />

      <Physics>
        {/* Debug */}
        <Debug />

        {/* Dice */}
        <RigidBody
          mass={DICE_MASS}
          restitution={DICE_BOUNCINESS}
          friction={DICE_FRICTION}
          ref={dice}
          position={[0, 1, 2]}
          onSleep={() => {
            !myTurn && setMyTurn(true)
            const number = getDiceNumber(dice.current)
            console.log(number)
          }}
        >
          <group name="Dice" ref={ref}>
            <mesh
              name="DiceGeo"
              geometry={nodes.DiceGeo.geometry}
              material={materials.DiceWhite}
            />
            <mesh
              name="DiceGeo_1"
              geometry={nodes.DiceGeo_1.geometry}
              material={materials.DiceDark}
            />
          </group>
        </RigidBody>
        <RigidBody
          mass={DICE_MASS}
          restitution={DICE_BOUNCINESS}
          friction={DICE_FRICTION}
          ref={dice2}
          position={[0.1, 1, 2]}
          onSleep={() => {
            !myTurn && setMyTurn(true)
            const number = getDiceNumber(dice2.current)
            console.log(number)
          }}
        >
          <group name="Dice">
            <mesh
              name="DiceGeo"
              geometry={nodes.DiceGeo.geometry}
              material={materials.DiceWhite}
            />
            <mesh
              name="DiceGeo_1"
              geometry={nodes.DiceGeo_1.geometry}
              material={materials.DiceDark}
            />
          </group>
        </RigidBody>

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
        <RigidBody ref={checker} {...bind()} type="kinematicPosition">
          <mesh
            name="WhiteChecker"
            geometry={nodes.WhiteChecker.geometry}
            material={materials.WhiteCheckerMat}
          />
        </RigidBody>

        {/* <WhiteCheckers
          geometry={nodes.WhiteChecker.geometry}
          material={materials.WhiteCheckerMat}
        /> */}

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

const Dice = forwardRef(({ nodes, materials }, ref) => {
  return (
    // <Clone>
    <RigidBody mass={0.2} ref={ref} position={[-0.8, 1.5, 0]}>
      <mesh name="DiceGeo" geometry={nodes[0]} material={materials[0]} />
      <mesh name="DiceGeo_1" geometry={nodes[1]} material={materials[1]} />
    </RigidBody>
    // {/* </Clone> */}
  )
})

export default Game
