/**
 * This method will return true if the game is in endgame
 * @param {*} checkers All checkers positions
 * @param {*} color The checker color to be checked
 * @returns True if the game is in endgame, else false
 */

const Endgame = (checkers, color) => {
  const checkers1 = checkers.filter((checker) => checker.color === color)

  let checkers2 = []
  if (color === "white") {
    checkers2 = checkers1.filter(
      (checker) => checker.col >= 18 || checker.col === -3
    )
  } else {
    checkers2 = checkers1.filter(
      (checker) => checker.col <= 5 || checker.col === -4
    )
  }

  if (checkers2.length === 15) {
    return true
  }
  return false
}

export default Endgame
