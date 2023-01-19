import { RigidBody } from "@react-three/rapier"
import { forwardRef, useContext, useState } from "react"
import * as data from "./data/Data"
import { GameState } from "./Game"
import getDiceNumber from "./utils/GetDiceNumber"

const Dice = forwardRef(({ index, position, setFinishedThrow }, ref) => {
  const { nodes, materials, diceNums } = useContext(GameState)

  return (
    <RigidBody
      mass={data.DICE_MASS}
      restitution={data.DICE_BOUNCINESS}
      friction={data.DICE_FRICTION}
      ref={ref}
      position={position}
      onWake={() => {
        setFinishedThrow((current) => {
          const newCurrent = { ...current }
          newCurrent[index] = false
          return newCurrent
        })
      }}
      onSleep={() => {
        // You could use a settimeout for this, somehow. it will speed up the gettting the dice number process.
        const number = getDiceNumber(ref.current)
        diceNums.current[index] = number

        setFinishedThrow((current) => {
          const newCurrent = { ...current }
          newCurrent[index] = true
          return newCurrent
        })
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
  )
})

export default Dice
