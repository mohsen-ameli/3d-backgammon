import { RigidBodyApi } from "@react-three/rapier"

/**
 * Checking if the dice are on the board, by their elevation
 * @param dice Rigid body of a single die
 * @returns boolean
 */
const DiceOnBoard = (dice: RigidBodyApi) => {
  return dice.translation().y < 0.5
}

export default DiceOnBoard
