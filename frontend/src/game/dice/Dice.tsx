import { RigidBody, RigidBodyApi } from "@react-three/rapier"
import { forwardRef, useContext, useRef } from "react"
import { Group, PositionalAudio, Raycaster, Vector3 } from "three"
import { GameContext } from "../context/GameContext"
import * as data from "../data/Data"
import { DiceReadyType } from "../types/Dice.type"
import DiceOnBoard from "./utils/DiceOnBoard"
import IsInitial from "./utils/IsInitial"

type DiceProps = {
  index: 0 | 1
  position: Vector3
  setFinishedThrow: React.Dispatch<React.SetStateAction<DiceReadyType>>
  setSleeping: React.Dispatch<React.SetStateAction<DiceReadyType>>
  showThrowBtn: boolean
  audio: PositionalAudio | undefined
}

// Direction vector for the raycaster
const directionVector = new Vector3(0, -1, 0)

/**
 * Individual die
 */
const Dice = forwardRef<RigidBodyApi, DiceProps>((props, ref) => {
  const {
    index,
    position,
    setFinishedThrow,
    setSleeping,
    showThrowBtn,
    audio,
  } = props

  // Game context
  const { nodes, materials, dice, myTurn, settings } = useContext(GameContext)

  // Rigid body reference of each die
  const rigidBody = (ref as React.MutableRefObject<RigidBodyApi>).current

  const groupRef = useRef<Group>(null)
  const diceRef1 = useRef<Group>(null)
  const diceRef2 = useRef<Group>(null)
  const diceRef3 = useRef<Group>(null)
  const diceRef4 = useRef<Group>(null)
  const diceRef5 = useRef<Group>(null)
  const diceRef6 = useRef<Group>(null)

  // When the die collides with something, play a sound
  const handleCollisionEnter = () => {
    if (!DiceOnBoard(rigidBody) || !settings.sound || !audio) return
    audio.setVolume(Math.random())
    audio.play()
  }

  // When the die wakes up
  const handleWake = () => {
    // If the user is not playing, meaning other user has thrown their dice, and we're just viewing the animation
    if (!myTurn) return

    setFinishedThrow(current => {
      const newCurrent = { ...current }
      if (index === 0) newCurrent.dice1 = false
      else newCurrent.dice2 = false
      return newCurrent
    })
  }

  // When the die goes to sleep, get the number on the dice, and save it.
  // TODO: Maybe we could use a settimeout for this, somehow. it will speed up the getting the dice number process.
  const handleSleep = async () => {
    // If the dice are not on the board, then return
    if (!DiceOnBoard(rigidBody) || showThrowBtn) {
      setSleeping({ dice1: true, dice2: true })
      return
    }

    // If the user is not playing, meaning other user has thrown their dice, and we're just viewing the animation
    if (!myTurn) return

    // Getting the die number and saving it to the dice ref
    if (!IsInitial(rigidBody.rotation())) {
      if (
        !diceRef1.current ||
        !diceRef2.current ||
        !diceRef3.current ||
        !diceRef4.current ||
        !diceRef5.current ||
        !diceRef6.current
      )
        return

      const ray = new Raycaster()
      const diePos = rigidBody.translation()
      const posVec = new Vector3(diePos.x, diePos.y + 10, diePos.z)

      ray.set(posVec, directionVector)
      const intersections = ray.intersectObjects([
        diceRef1.current,
        diceRef2.current,
        diceRef3.current,
        diceRef4.current,
        diceRef5.current,
        diceRef6.current,
      ])
      const number = Number(intersections[0].object.name)
      if (index === 0) dice.current.dice1 = number
      else dice.current.dice2 = number
    }

    setFinishedThrow(current => {
      const newCurrent = { ...current }
      if (index === 0) newCurrent.dice1 = true
      else newCurrent.dice2 = true
      return newCurrent
    })
  }

  return (
    <RigidBody
      ref={ref}
      mass={data.DICE_MASS}
      restitution={data.DICE_BOUNCINESS}
      friction={data.DICE_FRICTION}
      position={position}
      onWake={handleWake}
      onSleep={handleSleep}
      onCollisionEnter={handleCollisionEnter}
    >
      <group scale={1.25} ref={groupRef} name="dice1">
        <group ref={diceRef1}>
          <mesh
            name="1"
            geometry={nodes.DiceGeo002.geometry}
            material={materials.DiceWhite}
          />
          <mesh
            name="1"
            geometry={nodes.DiceGeo002_1.geometry}
            material={materials.DiceDark}
          />
        </group>
        <group ref={diceRef2}>
          <mesh
            name="2"
            geometry={nodes.DiceGeo007.geometry}
            material={materials.DiceWhite}
          />
          <mesh
            name="2"
            geometry={nodes.DiceGeo007_1.geometry}
            material={materials.DiceDark}
          />
        </group>
        <group ref={diceRef3}>
          <mesh
            name="3"
            geometry={nodes.DiceGeo005.geometry}
            material={materials.DiceWhite}
          />
          <mesh
            name="3"
            geometry={nodes.DiceGeo005_1.geometry}
            material={materials.DiceDark}
          />
        </group>
        <group ref={diceRef4}>
          <mesh
            name="4"
            geometry={nodes.DiceGeo003.geometry}
            material={materials.DiceWhite}
          />
          <mesh
            name="4"
            geometry={nodes.DiceGeo003_1.geometry}
            material={materials.DiceDark}
          />
        </group>
        <group ref={diceRef5}>
          <mesh
            name="5"
            geometry={nodes.DiceGeo004.geometry}
            material={materials.DiceWhite}
          />
          <mesh
            name="5"
            geometry={nodes.DiceGeo004_1.geometry}
            material={materials.DiceDark}
          />
        </group>
        <group ref={diceRef6}>
          <mesh
            name="6"
            geometry={nodes.DiceGeo008.geometry}
            material={materials.DiceWhite}
          />
          <mesh
            name="6"
            geometry={nodes.DiceGeo008_1.geometry}
            material={materials.DiceDark}
          />
        </group>
      </group>
    </RigidBody>
  )
})

export default Dice
