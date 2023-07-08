import { useGameStore } from "@/game/store/useGameStore"
import { UserCheckerType } from "@/game/types/Checker.type"

/**
 * Checks to see if user has won the game
 */
export default function gameWon(color: UserCheckerType) {
  const checkers = useGameStore.getState().checkers!

  const allCheckers = checkers.filter(checker => checker.color === color)

  const onEndColCheckers =
    color === "white"
      ? allCheckers.filter(checker => checker.col === -3)
      : allCheckers.filter(checker => checker.col === -4)

  if (onEndColCheckers.length === 15) return true

  return false
}
