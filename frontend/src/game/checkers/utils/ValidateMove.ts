import { useGameStore } from "@/game/store/useGameStore"
import { CheckerType } from "@/game/types/Checker.type"

/**
 * Utility used in checkers to determine whether the move done by the user
 * is valid or not. This function gets called whenever the user is in an endgame.
 * If, for example, they roll a double 6, and they only have a few checkers (located one column
 * away from the "end column"), then that's a valid move they can make. This is an example
 * of a case in which this function is useful for.
 */
export default function ValidateMove(thisChecker: CheckerType, moved: number): boolean {
  const checkers = useGameStore.getState().checkers!
  const dice = useGameStore.getState().dice

  let backRankCheckers: CheckerType[]

  // Getting the number of checkers in the back of the current checker
  if (thisChecker.color === "black") {
    backRankCheckers = checkers.filter(checker => checker.col > thisChecker.col && checker.color === thisChecker.color)
  } else {
    backRankCheckers = checkers.filter(
      checker => checker.col >= 18 && checker.col < thisChecker.col && checker.color === thisChecker.color,
    )
  }

  // If there are no checkers behind the current checker,
  // and the dice number is greater than the how much the user moved
  if (backRankCheckers.length === 0 && (dice.dice1 >= moved || dice.dice2 >= moved)) {
    return true
  }
  // The user has moved directly outside
  else if (dice.dice1 === moved || dice.dice2 === moved) {
    return true
  } else {
    return false
  }
}
