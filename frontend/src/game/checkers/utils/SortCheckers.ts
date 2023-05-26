import { useGameStore } from "@/game/store/useGameStore"
import { CheckerType } from "@/game/types/Checker.type"

/**
 * Sorting the checkers on the new row and the old columns of this checker instance
 */
export default function SortCheckers(from: number) {
  const checkers = useGameStore.getState().checkers!
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
