import lenRemovedCheckers from "../utils/LenRemovedCheckers"
import { useGameStore } from "../store/useGameStore"
import getCheckersOnCol from "../utils/getCheckersOnCol"

// Checks to see if a hover over a column is valid
export default function getValidHover(colId: number) {
  const checker = useGameStore.getState().checkerPicked
  // If no checker is picked, return false
  if (!checker) return false

  const { dice1, dice2 } = useGameStore.getState().dice

  // If user is hovering over the column of the current checker
  if (checker.col === colId) return false

  const { action } = getCheckersOnCol(colId, checker.color)

  if (checker.removed) {
    const valid = [dice1, dice2].includes(checker.color === "white" ? colId + 1 : 24 - colId)
    return valid && action !== "invalid"
  }

  // If user has removed checkers and is moving a different checker
  const lenRmCheckers = lenRemovedCheckers(checker.color)
  if (lenRmCheckers != 0) return false

  const whiteCondition = checker.col + dice1 === colId || checker.col + dice2 === colId
  const blackCondition = checker.col - dice1 === colId || checker.col - dice2 === colId

  if (checker.color === "white" ? whiteCondition : blackCondition) {
    return action === "invalid" ? false : true
  } else {
    return false
  }
}
