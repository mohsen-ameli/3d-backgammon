import { useGameStore } from "@/game/store/useGameStore"
import { UserCheckerType } from "../../types/Checker.type"

type PipType = { col: number; num: number }

/**
 * Calculates the user pip (or score).
 * Reference: https://www.bkgm.com/gloss/lookup.cgi?pip+count
 */
export default function PipScore(color: UserCheckerType) {
  const checkers = useGameStore.getState().checkers

  if (!checkers) return 0

  let pip: number = 0
  const userCheckers = checkers.filter(checker => checker.color === color)
  const checkerDict: PipType[] = []

  for (let i = 1; i <= 24; i++) {
    const num = userCheckers.filter(checker => checker.col === i - 1).length
    const col = color === "white" ? 25 - i : i
    checkerDict.push({ col, num })
  }

  for (const row of checkerDict) {
    if (row.num !== 0) {
      pip += row.num * row.col
    }
  }

  return pip
}
