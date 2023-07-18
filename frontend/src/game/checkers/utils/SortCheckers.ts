import { useGameStore } from "@/game/store/useGameStore"

/**
 * Sorting the checkers on the new row and the old columns of this checker instance
 */
export default function sortCheckers(col: number) {
  const checkers = useGameStore.getState().checkers!
  const checkersOnCol = checkers.filter(checker => checker.col === col)

  if (checkersOnCol.length < 1) return

  for (let i = 0; i < checkersOnCol.length; i++) {
    checkersOnCol[i].row = i
  }
}
