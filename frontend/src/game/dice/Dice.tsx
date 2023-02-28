import { RigidBody, RigidBodyApi } from "@react-three/rapier"
import { forwardRef, useContext, useState } from "react"
import * as data from "../data/Data"
import { GameState } from "../Game"
import newDice from "../../assets/sounds/NewDice.wav"
import { Vector3 } from "three"
import { finishedThrowType } from "../types/Dice.type"
import getDiceNumber from "../utils/GetDiceNumber"
import IsInitial from "./IsInitial"
import DiceOnBoard from "./DiceOnBoard"

type DiceProps = {
  index: 0 | 1
  position: Vector3
  setFinishedThrow: React.Dispatch<React.SetStateAction<finishedThrowType>>
  setSleeping: React.Dispatch<React.SetStateAction<finishedThrowType>>
}

/**
 * Individual die
 */
const Dice = forwardRef<RigidBodyApi, DiceProps>((props, ref) => {
  const { index, position, setFinishedThrow, setSleeping } = props
  const { nodes, materials, dice, myTurn } = useContext(GameState)

  // Rigid body reference of each die
  const rigidBody = (ref as React.MutableRefObject<RigidBodyApi>).current

  // Colission audio
  const [audio] = useState(() => new Audio(newDice))

  // When the die collides with someting
  const colissionEnter = () => {
    if (!DiceOnBoard(rigidBody)) return

    audio.currentTime = 0
    audio.volume = Math.random()
    audio.play().catch(() => {
      console.log(
        "Error playing audio, since user hasn't interacted with the website."
      )
    })
  }

  // When the die wakes up
  const onWake = () => {
    // If the user is not playing, meaning other user has thrown their dice, and we're just viewing the animation
    if (!myTurn) return

    setFinishedThrow((current) => {
      const newCurrent = { ...current }
      newCurrent[index] = false
      return newCurrent
    })
  }

  // When the die goes to sleep
  // TODO: Maybe we could use a settimeout for this, somehow. it will speed up the gettting the dice number process.
  const onSleep = () => {
    // If the dice are not on the board, then return
    if (!DiceOnBoard(rigidBody)) {
      setSleeping({ 0: true, 1: true })
      return
    }

    // If the user is not playing, meaning other user has thrown their dice, and we're just viewing the animation
    if (!myTurn) return

    // Getting the die number and saving it to the dice ref
    if (!IsInitial(rigidBody.rotation())) {
      const number = getDiceNumber(rigidBody)
      if (index === 0) dice.current.dice1 = number
      else dice.current.dice2 = number
    }

    setFinishedThrow((current) => {
      const newCurrent = { ...current }
      newCurrent[index] = true
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
      onWake={onWake}
      onSleep={onSleep}
      onCollisionEnter={colissionEnter}
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
