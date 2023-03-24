import { RigidBody, RigidBodyApi } from "@react-three/rapier"
import { forwardRef, useContext } from "react"
import * as data from "../data/Data"
import { GameContext } from "../context/GameContext"
import { PositionalAudio, Vector3 } from "three"
import { DiceReadyType } from "../types/Dice.type"
import useGetDiceNumberAI from "../utils/useGetDiceNumberAI"
import IsInitial from "./IsInitial"
import DiceOnBoard from "./DiceOnBoard"

type DiceProps = {
  index: 0 | 1
  position: Vector3
  setFinishedThrow: React.Dispatch<React.SetStateAction<DiceReadyType>>
  setSleeping: React.Dispatch<React.SetStateAction<DiceReadyType>>
  showThrowBtn: boolean
  audio: PositionalAudio | undefined
}

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

  // Dice number predictor (AI)
  const predict = useGetDiceNumberAI()

  // Rigid body reference of each die
  const rigidBody = (ref as React.MutableRefObject<RigidBodyApi>).current

  // const euler = new Euler()
  // euler.setFromQuaternion(rigidBody.rotation())
  // console.log("index: ", index, euler)

  // When the die collides with someting, play a sound
  const handleColissionEnter = () => {
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
  // TODO: Maybe we could use a settimeout for this, somehow. it will speed up the gettting the dice number process.
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
      const number = await predict(rigidBody)
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
      onCollisionEnter={handleColissionEnter}
    >
      <mesh
        name="DiceGeo"
        geometry={nodes.DiceGeo.geometry}
        material={materials.DiceWhite}
        castShadow
      />
      <mesh
        name="DiceGeo_1"
        geometry={nodes.DiceGeo_1.geometry}
        material={materials.DiceDark}
        castShadow
      />
    </RigidBody>
  )
})

export default Dice
