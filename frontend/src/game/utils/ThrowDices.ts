import { RigidBodyApi } from "@react-three/rapier"

/**
 * This will throw the dices into the board.
 */
const throwDices = (dices: RigidBodyApi[]): void => {
  for (const dice of dices) {
    const randX = Math.random() * 0.5

    dice.applyImpulse(
      {
        x: randX,
        y: 1,
        z: -1,
      },
      true
    )

    const randX_ = Math.random() / 200 - 0.005
    const randY_ = Math.random() / 200 - 0.005
    const randZ_ = Math.random() / 200 - 0.005

    dice.applyTorqueImpulse(
      {
        x: randX_,
        y: randY_,
        z: randZ_,
      },
      true
    )
  }
}

export default throwDices
