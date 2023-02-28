import { RigidBodyApi } from "@react-three/rapier"
import { DiePhysics } from "../types/Dice.type"

// This will reproduce a bug for when the dice stack up
const a = {
  phsycis: true,
  user: {
    id: 1,
    physics: {
      die1: {
        impulse: { x: 0.06459867158174659, y: 1, z: -1 },
        torque: {
          x: -0.0008706901273820124,
          y: -0.0008624117783537499,
          z: -0.002679207645409588,
        },
      },
      die2: {
        impulse: { x: 0.11044231744069688, y: 1, z: -1 },
        torque: {
          x: -0.0028727286246223584,
          y: -0.0013517523215425863,
          z: -0.0012536231196990698,
        },
      },
    },
  },
}

/**
 * This will throw the dice into the board.
 */
const throwDices = (dice: RigidBodyApi[]) => {
  const physicsValues = {
    die1: {} as DiePhysics,
    die2: {} as DiePhysics,
  }

  let i = 0

  for (const die of dice) {
    const impulse = {
      x: Math.random() * 0.5,
      y: 1,
      z: -1,
    }

    const torque = {
      x: Math.random() / 200 - 0.005,
      y: Math.random() / 200 - 0.005,
      z: Math.random() / 200 - 0.005,
    }

    die.applyImpulse(impulse, true)
    die.applyTorqueImpulse(torque, true)

    if (i === 0) {
      physicsValues.die1.impulse = impulse
      physicsValues.die1.torque = torque
      i++
    } else {
      physicsValues.die2.impulse = impulse
      physicsValues.die2.torque = torque
    }
  }

  return physicsValues
}

/**
 * Throwing the dice, with given impulse and torque
 */
export const throwDicePhysics = (
  dice: RigidBodyApi[],
  physics?: {
    die1: DiePhysics
    die2: DiePhysics
  }
) => {
  if (physics) {
    dice[0].applyImpulse(physics.die1.impulse, true)
    dice[0].applyTorqueImpulse(physics.die1.torque, true)
    dice[1].applyImpulse(physics.die2.impulse, true)
    dice[1].applyTorqueImpulse(physics.die2.torque, true)
  }
}

export default throwDices
