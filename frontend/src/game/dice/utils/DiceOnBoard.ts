import { RigidBodyApi } from "@react-three/rapier"

/**
 * Checking if the dice are on the board, by their elevation
 * @param dice Rigid body of a single die
 * @returns boolean
 */
export default function DiceOnBoard(dice: RigidBodyApi) {
  return dice.translation().y < 0.5
}
