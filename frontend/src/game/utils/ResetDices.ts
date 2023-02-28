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
    die.resetForces()
    die.resetTorques()

    die.setRotation(quat, false)
    die.setTranslation({ ...data.DICE_1_DEFAULT_POS }, false)
  }
}

export default resetDices
