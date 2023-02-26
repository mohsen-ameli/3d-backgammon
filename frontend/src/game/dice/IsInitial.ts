import { Quaternion } from "three"

// Are the dice in their initial position
const IsInitial = (quatornion: Quaternion) => {
  if (
    quatornion.x === 0.00048353226156905293 &&
    quatornion.y === 0.005327336024492979 &&
    quatornion.z === -0.00011967308091698214 &&
    quatornion.w === 0.9999856352806091
  )
    return true
  return false
}

export default IsInitial
