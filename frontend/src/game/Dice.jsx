import { RigidBody } from "@react-three/rapier"
import { forwardRef, useContext } from "react"
import * as data from "./data/Data"
import { GameState } from "./Game"
import getDiceNumber from "./utils/GetDiceNumber"

const Dice = forwardRef(({ position }, ref) => {
  const { nodes, materials } = useContext(GameState)

  return (
    <RigidBody
      mass={data.DICE_MASS}
      restitution={data.DICE_BOUNCINESS}
      friction={data.DICE_FRICTION}
      ref={ref}
      position={position}
      onSleep={() => {
        // !myTurn && setMyTurn(true)
        const number = getDiceNumber(ref.current)
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
