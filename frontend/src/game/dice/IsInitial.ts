import { Quaternion } from "three"
import { DEFAULT_DICE_QUATERNION } from "../data/Data"

// Are the dice in their initial position
const IsInitial = (quatornion: Quaternion) => {
  if (quatornion === DEFAULT_DICE_QUATERNION) return true
  return false
}

export default IsInitial
