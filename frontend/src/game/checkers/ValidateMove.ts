import { CheckerType } from "../types/Checker.type"
import { DiceType } from "../types/Dice.type"

/**
 * Utility used in checkers to determine whether the move done by the user
 * is valid or not. This function gets called whenever the user is in an endgame.
 * If they have rolled a double 6, as an example, and only have a few checkers, right
 * next to their end column, then that's a valid move they can make. This is an example
 * of a case in which this function is usefull for.
 */
const ValidateMove = (
  checkers: CheckerType[],
  thisChecker: CheckerType,
  dice: DiceType,
  moved: number
): boolean => {
  let backRankCheckers
  let validMove = false

  // Getting the number of checkers in the back of the current checker
  if (thisChecker.color === "black") {
    backRankCheckers = checkers.filter(
      (checker) =>
        checker.col > thisChecker.col && checker.color === thisChecker.color
    )
  } else {
    backRankCheckers = checkers.filter(
      (checker) =>
        checker.col >= 18 &&
        checker.col < thisChecker.col &&
        checker.color === thisChecker.color
    )
  }

  backRankCheckers = backRankCheckers.length

  // If there are no checkers behind the current checker,
  // and the dice number is greater than the how much the user moved
  if (backRankCheckers === 0 && (dice.dice1 >= moved || dice.dice2 >= moved)) {
    moved = dice.dice1 > dice.dice2 ? dice.dice1 : dice.dice2
    validMove = true
  }
  // The user has moved directly outside
  else if (dice.dice1 === moved || dice.dice2 === moved) {
    validMove = true
  }

  return validMove
}

export default ValidateMove
