// Checks to see if a hover over a column is valid

import { useContext } from "react"
import { GameContext } from "../context/GameContext"
import { CheckerType } from "../types/Checker.type"
import lenRemovedCheckers from "../utils/LenRemovedCheckers"
import useGetCheckersOnCol from "../utils/useGetCheckersOnCol"

const useGetValidHover = () => {
  const { dice, checkers } = useContext(GameContext)

  // Utility
  const { getCheckersOnCol } = useGetCheckersOnCol()

  const getValidHover = (checker: CheckerType, colId: number) => {
    // If user is hovering over the column of the current checker
    if (checker.col === colId) return false

    if (checker.color === "black") {
      const { action } = getCheckersOnCol(colId, "black")

      if (checker.removed) {
        const valid = [dice.current.dice1, dice.current.dice2].includes(
          24 - colId
        )
        return valid && action !== "invalid"
      }

      // If user has removed checkers and is moving a different checker
      const lenRmCheckers = lenRemovedCheckers(checkers.current, checker.color)
      if (lenRmCheckers != 0) return false

      if (
        checker.col - dice.current.dice1 === colId ||
        checker.col - dice.current.dice2 === colId
      ) {
        if (action === "invalid") return false
        return true
      }
    } else {
      const { action } = getCheckersOnCol(colId, "white")

      if (checker.removed) {
        const valid = [dice.current.dice1, dice.current.dice2].includes(
          colId + 1
        )
        return valid && action !== "invalid"
      }

      // If user has removed checkers and is moving a different checker
      const lenRmCheckers = lenRemovedCheckers(checkers.current, checker.color)
      if (lenRmCheckers != 0) return false

      if (
        checker.col + dice.current.dice1 === colId ||
        checker.col + dice.current.dice2 === colId
      ) {
        if (action === "invalid") return false
        return true
      }
    }
    return false
  }

  return { getValidHover }
}

export default useGetValidHover
