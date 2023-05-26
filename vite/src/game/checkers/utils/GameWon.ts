import { CheckerType, UserCheckerType } from "../../types/Checker.type"

/**
 * Checks to see if user has won the game
 */
const GameWon = (checkers: CheckerType[], color: UserCheckerType) => {
  const allCheckers = checkers.filter(checker => checker.color === color)

  const onEndColCheckers =
    color === "white"
      ? allCheckers.filter(checker => checker.col === -3)
      : allCheckers.filter(checker => checker.col === -4)

  if (onEndColCheckers.length === 15) return true

  return false
}

export default GameWon
