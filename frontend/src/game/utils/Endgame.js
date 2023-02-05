/**
 * This method will return true if the game is in endgame for the color of the checkers provided.
 * @param {*} checkers All checkers positions
 * @param {*} color The checker color to be checked
 * @returns True if the game is in endgame, otherwise false
 */

const Endgame = (checkers, color) => {
  const userCheckers = checkers.filter((checker) => checker.color === color)

  let inHouseCheckers
  if (color === "white") {
    inHouseCheckers = userCheckers.filter(
      (checker) => checker.col >= 18 || checker.col === -3
    ).length
  } else {
    inHouseCheckers = userCheckers.filter(
      (checker) => checker.col <= 5 || checker.col === -4
    ).length
  }

  if (inHouseCheckers === 15) return true

  return false
}

export default Endgame
