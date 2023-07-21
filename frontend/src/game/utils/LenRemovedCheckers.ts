import { useGameStore } from "../store/useGameStore"
import { UserCheckerType } from "../types/Checker.type"

/**
 * @returns the length of removed checkers of a given color
 */
export default function lenRemovedCheckers(color: UserCheckerType): number {
  const checkers = useGameStore.getState().checkers

  const removed = checkers.filter(checker => {
    return checker.color === color ? checker.removed : null
  })

  return removed.length
}
