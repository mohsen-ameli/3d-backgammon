import * as THREE from "three"

const resetDiceRotation = (dices) => {
  const quat = new THREE.Quaternion(
    0.00048353226156905293,
    0.005327336024492979,
    -0.00011967308091698214,
    0.9999856352806091
  )

  dices[0].setRotation(quat)
  dices[1].setRotation(quat)
  // ref.current.setOrientation(0, 0, 0, 1)
  // ref.current.setAngularVelocity(0, 0, 0)
  // ref.current.setLinearVelocity(0, 0, 0)
}

export default resetDiceRotation
