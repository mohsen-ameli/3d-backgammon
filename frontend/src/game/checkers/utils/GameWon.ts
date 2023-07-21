import { useGameStore } from "@/game/store/useGameStore"
import { UserCheckerType } from "@/game/types/Checker.type"

/**
 * Checks to see if user has won the game
 */
export default function gameWon(color: UserCheckerType) {
  const checkers = useGameStore.getState().checkers
  const endCol = color === "white" ? -3 : -4

  const checkersOnEndCol = checkers.filter(checker => checker.color === color && checker.col === endCol)

  if (checkersOnEndCol.length === 15) {
    return true
  } else {
    return false
  }
}
