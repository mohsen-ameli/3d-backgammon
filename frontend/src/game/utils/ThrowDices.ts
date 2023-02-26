import { RigidBodyApi } from "@react-three/rapier"

/**
 * This will throw the dices into the board.
 */
const throwDices = (dices: RigidBodyApi[]): void => {
  for (const dice of dices) {
    dice.applyImpulse(
      {
        x: Math.random() * 0.5,
        y: 1,
        z: -1,
      },
      true
    )

    dice.applyTorqueImpulse(
      {
        x: Math.random() / 200 - 0.005,
        y: Math.random() / 200 - 0.005,
        z: Math.random() / 200 - 0.005,
      },
      true
    )
  }
}

export default throwDices
