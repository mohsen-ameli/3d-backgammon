import { RigidBody } from "@react-three/rapier"
import { forwardRef, useContext } from "react"
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
        if (diceOnBoard(ref.current)) {
          // => MAYBE: You could use a settimeout for this, somehow. it will speed up the gettting the dice number process.

          // Getting the dice number and saving it to diceNums
          if (!isInitial(ref.current.rotation())) {
            const number = getDiceNumber(ref.current)
            if (index === 0) {
              diceNums.current.dice1 = number
            } else {
              diceNums.current.dice2 = number
            }
          }

          setFinishedThrow((current) => {
            const newCurrent = { ...current }
            newCurrent[index] = true
            return newCurrent
          })
        }
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

const isInitial = (quatornion) => {
  if (
    quatornion.x === 0.00048353226156905293 &&
    quatornion.y === 0.005327336024492979 &&
    quatornion.z === -0.00011967308091698214 &&
    quatornion.w === 0.9999856352806091
  ) {
    return true
  } else {
    return false
  }
}

const diceOnBoard = (dice) => {
  return dice.translation().y < 0.5
}

export default Dice
