import { Quaternion } from "three"
import { DEFAULT_DICE_QUATERNION } from "../../data/Data"

/**
 * Are the dice in their initial position
 * @param quaternion
 * @returns boolean
 */
const IsInitial = (quaternion: Quaternion) => {
  if (quaternion === DEFAULT_DICE_QUATERNION) return true
  return false
}

export default IsInitial
