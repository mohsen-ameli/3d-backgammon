/**
 * This will throw the dice(s) around.
 * @param {*} dices A list of dices to throw. (dice.current)
 */
const throwDices = (dices) => {
  for (const dice of dices) {
    dice.applyImpulse({
      x: Math.random() * 0.5,
      y: 1,
      z: -1,
    })

    dice.applyTorqueImpulse({
      x: Math.random() / 200 - 0.005,
      y: Math.random() / 200 - 0.005,
      z: Math.random() / 200 - 0.005,
    })
  }
}

export default throwDices
