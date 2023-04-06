import { useContext } from "react"
import { GameContext } from "../context/GameContext"
import { CheckerType, UserCheckerType } from "../types/Checker.type"

type ReturnType = {
  action: "valid" | "invalid" | "remove"
  numCheckers: number
  rmChecker?: CheckerType
}

/**
 * This method takes in a reference to all of the checkers on the board,
 * the color and the column number of the checker that we are interested in.
 * @returns An object containing a valid action, number of checkers on the
 * specified column, and IF the column is filled by exactly one of the enemy
 * checker, then we will return that checker in the form of rmChecker, as
 * specified above.
 */
const useGetCheckersOnCol = () => {
  const { checkers } = useContext(GameContext)

  const getCheckersOnCol = (
    col: number,
    color: UserCheckerType
  ): ReturnType => {
    const checkersOnCol = checkers.current.filter(item => item.col === col)
    const lenCheckersOnCol = checkersOnCol.length
    let onCol = {} as ReturnType

    // The first checker on the column is the same color as the one being moved
    if (lenCheckersOnCol === 0 || checkersOnCol[0].color === color) {
      onCol = { action: "valid", numCheckers: lenCheckersOnCol }
    }

    // There is exactly one checker on this column that belongs to the enemy
    else if (lenCheckersOnCol === 1) {
      onCol = {
        action: "remove",
        numCheckers: 1,
        rmChecker: checkersOnCol[0],
      }
    }

    // Invalid move
    else onCol = { action: "invalid", numCheckers: NaN }

    return onCol
  }

  return { getCheckersOnCol }
}

export default useGetCheckersOnCol
