import { UserCheckerType } from "../types/Game.type"
import { CheckerType } from "../types/Checker.type"

/**
 * @returns the length of removed checkers of a given color
 */
const lenRemovedCheckers = (
  checkers: CheckerType[],
  color: UserCheckerType
): number => {
  const removed = checkers.filter(checker => {
    return checker.color === color ? checker.removed : null
  })

  return removed.length
}

export default lenRemovedCheckers
