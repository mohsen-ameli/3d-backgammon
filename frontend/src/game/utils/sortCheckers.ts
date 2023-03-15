import { CheckerType } from "../types/Checker.type"

/**
 * Sorting the checkers on the new row and the old columns of this checker instance
 */
const sortCheckers = (checkers: CheckerType[], from: number, to: number) => {
  const checkersOnFromCol = checkers.filter(checker => checker.col === from)
  const checkersOnToCol = checkers.filter(checker => checker.col === from)

  sort(checkersOnFromCol)
  sort(checkersOnToCol)

  function sort(checkersList: CheckerType[]) {
    if (checkersList.length > 1) {
      let i = 0
      for (const checker of checkersList) {
        checkers[checker.id].row = i
        i++
      }
    }
  }
}

export default sortCheckers
