import { CheckerType, UserCheckerType } from "../types/Checker.type"

/**
 * This method will return true if the game is in endgame for the color of the checkers provided.
 * @returns True if the game is in endgame, otherwise false
 */
const Endgame = (checkers: CheckerType[], color: UserCheckerType): boolean => {
  const userCheckers = checkers.filter(checker => checker.color === color)

  let inHouseCheckers
  if (color === "white") {
    inHouseCheckers = userCheckers.filter(
      checker => checker.col >= 18 || checker.col === -3
    ).length
  } else {
    inHouseCheckers = userCheckers.filter(
      checker => checker.col <= 5 || checker.col === -4
    ).length
  }

  if (inHouseCheckers === 15) return true

  return false
}

export default Endgame
