import { useGameStore } from "@/game/store/useGameStore"

/**
 * Sorting the checkers on the new row and the old columns of this checker instance
 */
export default function sortCheckers(from: number) {
  const checkers = useGameStore.getState().checkers!
  const checkersOnFromCol = checkers.filter(checker => checker.col === from)

  if (checkersOnFromCol.length >= 1) {
    let i = 0
    for (const checker of checkersOnFromCol) {
      checkers[checker.id].row = i
      i++
    }
  }
}
