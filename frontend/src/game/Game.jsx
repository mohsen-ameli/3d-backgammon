import { Clone, Html, OrbitControls, useGLTF } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { forwardRef, useContext, useEffect, useRef } from "react"
import { AuthContext } from "../context/AuthContext"
import models from "../assets/models/models.glb"
import { Perf } from "r3f-perf"
import * as THREE from "three"
import Button from "../components/ui/Button"
import { CuboidCollider, Debug, Physics, RigidBody } from "@react-three/rapier"
import { useControls } from "leva"
import { Raycaster, Vector3 } from "three"

let OriginalWhiteColumnColor = new THREE.Color()

const WhiteColumnMat = new THREE.MeshStandardMaterial()
const DarkColumnMat = new THREE.MeshStandardMaterial()

const DICE_MASS = 0.2
const DICE_BOUNCINESS = 0.9
const DICE_FRICTION = 0.4

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
  const raycasterRef = useRef(new Raycaster())
  const { nodes, materials } = useGLTF(models)
  const state = useThree()

  useEffect(() => {
    // Optimizing the triangle columns inside the board
    WhiteColumnMat.copy(materials.ColumnWhite)
    OriginalWhiteColumnColor.copy(WhiteColumnMat.color)
    DarkColumnMat.copy(materials.ColumnDark)

    // // Get the origin of the cube
    // const origin = ref.current.position
    // // Set the origin of the raycaster
    // raycasterRef.current.set(origin, new Vector3())

    // raycasterRef.current.ray.recast()

    // // Define an array of directions to shoot the rays
    // const directions = [
    //   new Vector3(1, 0, 0),
    //   new Vector3(-1, 0, 0),
    //   new Vector3(0, 1, 0),
    //   new Vector3(0, -1, 0),
    //   new Vector3(0, 0, 1),
    //   new Vector3(0, 0, -1),
    // ]

    // // Iterate over the directions array
    // for (let i = 0; i < directions.length; i++) {
    //   // Set the direction of the raycaster
    //   raycasterRef.current.direction.copy(directions[i])

    //   // Cast the ray and check if it intersects the cube
    //   const intersections = raycasterRef.current.intersectObjects([ref.current])
    //   if (intersections.length > 0) {
    //     console.log(`Ray ${i} hit the cube!`)
    //     if (raycasterRef.current.direction.y > 0.5) {
    //       console.log("ray is pointing up")
    //     }
    //   }
    // }
  }, [])

  const getRotation = () => {
    const euler = new THREE.Euler()
    euler.setFromQuaternion(dice.current.rotation())

    // const x = euler.x
    //   .toFixed(2)
    //   .replace("-0.00", "0.00")
    //   .replace("-3.14", "3.14")
    // const y = euler.y
    //   .toFixed(2)
    //   .replace("-0.00", "0.00")
    //   .replace("-3.14", "3.14")
    // const z = euler.z
    //   .toFixed(2)
    //   .replace("-0.00", "0.00")
    //   .replace("-3.14", "3.14")
    // prettier-ignore
    // if ((x === "3.14" || x === "0.00") && (z === "3.14" || z === "0.00")) {
    //   console.log("probably a 1")
    // } else if ((x === "3.14" || x === "3.13") && (z === "1.57" || z === "1.56")) {
    //   console.log("probably a 2")
    // } else if (x === "-1.57" && (y === "3.14" || y === "0.00")) {
    //   console.log("probably a 3")
    // } else if (x === "1.57" && (y === "3.14" || y === "0.00")) {
    //   console.log("probably a 4")
    // } else if ((x === "3.14" || x === "0.00") && (z === "1.57" || z === "-1.57")) {
    //   console.log("probably a 5")
    // } else if ((x === "3.14" || x === "0.00") && (x === "3.14" || x === "0.00")) {
    //   console.log("probably a 6")
    // } else {
    //   console.log("uhhhhhhhhhh")
    // }

    console.log(euler)
    const x = Math.round(euler.x)
    const y = Math.round(euler.y)
    const z = Math.round(euler.z)

    // console.log(x, y, z)

    if ((x === 0 || x === 3) && (y === -1 || y === 1) && (z === 0 || z === 3)) {
      console.log("probably a 1")
    } else if ((x === 0 || x === 3) && z === 2) {
      console.log("probably a 2")
    } else if (x === -2 && y === 0) {
      console.log("probably a 3")
    } else if (x === 2 && y === 0) {
      console.log("probably a 4")
    } else if ((x === 0 || x === 3) && (z === 2 || z === -2)) {
      console.log("probably a 5")
    } else if ((x === 0 || x === 3) && (z === 0 || z === 3 || z === -3)) {
      console.log("probably a 6")
    } else {
      console.log("uhhhhhhhhhh")
    }

    // 1:
    // _x: 3.1256305108327114, _y: -1.5100878856031257, _z: 3.125425625711317
    // _x: 0.0015918107667124964, _y: 0.9168181096386551, _z: -0.0014976553076640048

    // 2:
    // _x: 3.1403126538063306, _y: 0.5320433465144419, _z: 1.5711823081418979
    // _x: 3.1404660421625574, _y: 0.20427773506826932, _z: 1.5707617934648705
    // 3.13 -1.47 1.56
    // 0.00 0.18 1.57
    // 3.13 -1.47 1.56
    // 3.09 -1.55 1.52

    // for a 3:
    // _x: -1.571931367850722, _y: 0.0001881356373814687, _z: 1.1767776045592004
    // _x: -1.5716724725046405, _y: -0.0007456993262120733, _z: 2.0462615833361797
    // _x: -1.5719437230744329, _y: 0.00008720360630970496, _z: 1.2655988224796977
    // _x: -1.5705021247792643, _y: -0.0011126348541532045, _z: -3.1129098026717217
    // _x: -1.5679237868561406, _y: -0.00046223189308869757, _z: 2.413183694896209
    // _x: -1.5714386432430838, _y: -0.0009548092019306174, _z: 2.3199923817585955
    // 1.57 0.00 0.43
    // 1.57 0.00 0.29

    // 4:
    // _x: 1.5704485392704945, _y: -0.0010548007623856653, _z: -0.5604116875573528
    // _x: 1.5699358580507827, _y: 0.0007026587804618466, _z: -2.497997867938556
    // _x: 1.5704696590969753, _y: 0.0010615663990524216, _z: -3.084984119105789
    // 1.57 0.00 0.70
    // 1.57 0.00 0.90
    // 1.57 0.00 -0.44

    // 5:
    // _x: 3.035690283587604, _y: 1.560705808182779, _z: -1.464636251655983
    // _x: 3.1326444980894523, _y: 1.4512781459940003, _z: -1.5616445013681182
    //  _x: 0.0011925065480864535, _y: -0.4628331346421611, _z: 1.5715953678039059
    // 0.00 -1.11 1.57
    // 3.14 -0.06 -1.57
    // 0.00 0.18 1.57
    // 0.00 0.18 1.57

    // for a 6:
    // _x: 3.140433369281573, _y: 0.3143679093589594, _z: 0.0006222094766355095
    // -2.60 -0.33 0.17 // for a slant 6
    // 3.14 0.61 0.00
    // 0.00 0.90 3.14
    // 0.00 0.90 3.14
  }

  const throwDice = () => {
    // The force to apply to the dice
    dice.current.applyImpulse({
      x: Math.random() * 0.5,
      y: 1,
      z: -1,
    })
    // dice2.current.applyImpulse({
    //   x: Math.random() * 0.5,
    //   y: 1,
    //   z: -1,
    // })

    // The rotation (torque) to apply to the dice
    dice.current.applyTorqueImpulse({
      x: Math.random() / 200 - 0.005,
      y: Math.random() / 200 - 0.005,
      z: Math.random() / 200 - 0.005,
    })
    // dice2.current.applyTorqueImpulse({
    //   x: Math.random() / 200 - 0.005,
    //   y: Math.random() / 200 - 0.005,
    //   z: Math.random() / 200 - 0.005,
    // })
  }

  return (
    <>
      <OrbitControls />

      <color args={["salmon"]} attach="background" />

      {/* <Perf position="top-left" /> */}

      <Html as="div" transform scale={0.2} position={[1.75, 0.5, 0]}>
        <Button className="text-white" onClick={throwDice}>
          Throw Dice
        </Button>
        {/* <Button className="text-white" onClick={getRotation}>
          Get rotation
        </Button> */}
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
        >
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
        <RigidBody>
          <mesh
            name="WhiteChecker"
            geometry={nodes.WhiteChecker.geometry}
            material={materials.WhiteCheckerMat}
            position={[0, 0.5, -0.6]}
          />
        </RigidBody>

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
      <directionalLight position={[0, 10, 5]} intensity={1} />
    </>
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
