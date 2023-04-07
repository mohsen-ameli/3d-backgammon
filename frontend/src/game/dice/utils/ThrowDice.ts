import { RigidBodyApi } from "@react-three/rapier"
import {
  DEFAULT_DICE_QUATERNION,
  DICE_1_DEFAULT_POS,
  DICE_2_DEFAULT_POS,
} from "../../data/Data"
import { UserCheckerType } from "../../types/Checker.type"
import { DiePhysics } from "../../types/Dice.type"

const DICE_SLEEP_ON_RESET = 1000 / 3 // 1000 ms / 3 -> 0.333 seconds

/**
 * This will throw the dice into the board, and return the physics values
 */
export const throwDice = async (
  dice: RigidBodyApi[],
  turn: UserCheckerType
) => {
  const physicsValues = {
    die1: {} as DiePhysics,
    die2: {} as DiePhysics,
  }

  let i = 0

  // Resetting the dice
  await resetDice(dice)

  for (const die of dice) {
    const x =
      turn === "white" ? 0.1 + Math.random() * 0.5 : -0.1 - Math.random() * 0.5

    const impulse = {
      x,
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

type Physics = {
  die1: DiePhysics
  die2: DiePhysics
}

/**
 * Throwing the dice, with given physics values (impulse and torque)
 */
export const throwDicePhysics = async (
  dice: RigidBodyApi[],
  physics: Physics
) => {
  let i = 0

  await resetDice(dice)

  for (const die of dice) {
    die.applyImpulse(
      i === 0 ? physics.die1.impulse : physics.die2.impulse,
      true
    )
    die.applyTorqueImpulse(
      i === 0 ? physics.die1.torque : physics.die2.torque,
      true
    )

    i++
  }
}

/**
 * This will reset the dice positions and rotations
 */
const resetDice = async (dice: RigidBodyApi[]) => {
  let i = 0

  for (const die of dice) {
    die.resetForces(true)
    die.resetTorques(true)

    die.setRotation(DEFAULT_DICE_QUATERNION, true)
    die.setTranslation(
      i === 0 ? { ...DICE_1_DEFAULT_POS } : { ...DICE_2_DEFAULT_POS },
      true
    )

    i++
  }

  await new Promise(res => setTimeout(res, DICE_SLEEP_ON_RESET))
}
