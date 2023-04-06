import { CheckerType } from "../../types/Checker.type"

/**
 * Sorting the checkers on the new row and the old columns of this checker instance
 */
const CheckersSort = (checkers: CheckerType[], from: number) => {
  const checkersOnFromCol = checkers.filter(checker => checker.col === from)

  sort(checkersOnFromCol)

  function sort(checkersList: CheckerType[]) {
    if (checkersList.length >= 1) {
      let i = 0
      for (const checker of checkersList) {
        checkers[checker.id].row = i
        i++
      }
    }
  }
}

export default CheckersSort
