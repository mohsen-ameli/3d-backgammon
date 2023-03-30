import * as data from "../data/Data"
import { CheckerType } from "../types/Checker.type"

type PositionsType = {
  x: number
  y: number
  z: number
}

/**
 * This function will get the position (x,y,z) of the checker on the board based on the given column and row
 * @returns An array of x, y, and z coordinates. The y (or the elevation) is the ground level
 */
const getCheckerPos = (checker: CheckerType): number[] => {
  // x is left and right on the board, y is elevation, and z is the forward and backwards of each checker.
  const position: PositionsType = { x: 0, y: 0, z: 0 }

  // Default elevation
  position.y = data.GROUND_CHECKERS

  // Checker is removed
  if (checker.removed) {
    position.x = 0
    position.y = data.GROUND + data.CHECKER_H + checker.row * 0.03 - 0.05
    position.z = checker.col === -1 ? 0.2 : -0.2

    return [position.x, position.y, position.z]
  }

  /**
   * End columns
   */
  // White end-house
  if (checker.col === -3) {
    position.x = data.BOARD_W + (data.CHECKER_W * 5.6) / 4
    position.y += 0.15
    position.z = 0.25 + 0.04 * checker.row
    return [position.x, position.y, position.z]
  }
  // Black end-house
  else if (checker.col === -4) {
    position.x = data.BOARD_W + (data.CHECKER_W * 5.6) / 4
    position.y += 0.15
    position.z = -0.825 + 0.04 * checker.row
    return [position.x, position.y, position.z]
  }

  /**
   * Quadrants
   */
  // Q1 (top right)
  if (checker.col <= 5) {
    position.x = data.BOARD_W - data.CHECKER_W * checker.col
    position.z = -data.BOARD_H + data.CHECKER_H * checker.row
  }
  // Q2 (top left)
  else if (checker.col <= 11) {
    position.x = -data.BOARD_W + data.CHECKER_W * (11 - checker.col)
    position.z = -data.BOARD_H + data.CHECKER_H * checker.row
  }
  // Q3 (bottom left)
  else if (checker.col <= 17) {
    position.x = -data.BOARD_W - data.CHECKER_W * (12 - checker.col)
    position.z = data.BOARD_H - data.CHECKER_H * checker.row
  }
  // Q4 (bottom right)
  else {
    position.x = data.BOARD_W - data.CHECKER_W * (18 - checker.col + 5)
    position.z = data.BOARD_H - data.CHECKER_H * checker.row
  }

  // There are less than 5 checkers in a row on the current column
  if (checker.row < 5) {
    return [position.x, position.y, position.z]
  }

  // Elevating and reordering the checker if the number of checker on the current column exceeds 5
  const newRow = Math.abs(5 - checker.row)
  position.y += 0.03

  // Q1 and Q2
  if (checker.col <= 5 || checker.col <= 11) {
    position.z = -data.BOARD_H + newRow * data.CHECKER_H + data.CHECKER_H / 2
  }
  // Q3 and Q4
  else {
    position.z = data.BOARD_H - newRow * data.CHECKER_H - data.CHECKER_H / 2
  }

  return [position.x, position.y, position.z]
}

export default getCheckerPos
