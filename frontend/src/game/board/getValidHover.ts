import { CheckerType } from "../types/Checker.type"
import lenRemovedCheckers from "../utils/LenRemovedCheckers"
import { useGameStore } from "../store/useGameStore"
import getCheckersOnCol from "../utils/getCheckersOnCol"

// Checks to see if a hover over a column is valid
export default function getValidHover(checker: CheckerType, colId: number) {
  const dice = useGameStore.getState().dice

  // If user is hovering over the column of the current checker
  if (checker.col === colId) return false

  if (checker.color === "black") {
    const { action } = getCheckersOnCol(colId, "black")

    if (checker.removed) {
      const valid = [dice.dice1, dice.dice2].includes(24 - colId)
      return valid && action !== "invalid"
    }

    // If user has removed checkers and is moving a different checker
    const lenRmCheckers = lenRemovedCheckers(checker.color)
    if (lenRmCheckers != 0) return false

    if (checker.col - dice.dice1 === colId || checker.col - dice.dice2 === colId) {
      if (action === "invalid") return false
      return true
    }
  } else {
    const { action } = getCheckersOnCol(colId, "white")

    if (checker.removed) {
      const valid = [dice.dice1, dice.dice2].includes(colId + 1)
      return valid && action !== "invalid"
    }

    // If user has removed checkers and is moving a different checker
    const lenRmCheckers = lenRemovedCheckers(checker.color)
    if (lenRmCheckers != 0) return false

    if (checker.col + dice.dice1 === colId || checker.col + dice.dice2 === colId) {
      if (action === "invalid") return false
      return true
    }
  }
  return false
}
