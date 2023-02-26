import { RigidBodyApi } from "@react-three/rapier"
import { Quaternion } from "three"
import * as data from "../data/Data"

/**
 * This will reset the dice positions and rotations
 */
const resetDices = (dice: RigidBodyApi[]): void => {
  const quat = new Quaternion(
    0.00048353226156905293,
    0.005327336024492979,
    -0.00011967308091698214,
    0.9999856352806091
  )

  for (const die of dice) {
    die.setRotation(quat, false)
    die.setRotation(quat, false)
    // ref.current.setOrientation(0, 0, 0, 1)
    // ref.current.setAngularVelocity(0, 0, 0)
    // ref.current.setLinearVelocity(0, 0, 0)

    die.setTranslation(
      {
        x: data.DICE_1_DEFAULT_POS.x,
        y: data.DICE_1_DEFAULT_POS.y,
        z: data.DICE_1_DEFAULT_POS.z,
      },
      false
    )
  }
}

export default resetDices
