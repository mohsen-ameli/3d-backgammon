import * as data from "../data/Data"
import { CheckerType } from "../types/Checker.type"

/**
 * This function will get the position (x,y,z) of the checker on the board based on the given column and row
 * @returns An array of x, y, and z coordinates. The y (or the elavation) is the ground level
 */
const getCheckerPos = (checker: CheckerType): number[] => {
  const position = []
  position[1] = data.GROUND_CHECKERS

  // Checker is removed
  if (checker.removed) {
    position[0] = 0
    position[1] = data.GROUND + data.CHECKER_H + checker.row * 0.03 - 0.05
    position[2] = checker.col === -1 ? 0.2 : -0.2

    return position
  }

  // Checker is going to the white ?endhouse?
  if (checker.col === -3) {
    position[0] = data.BOARD_W + (data.CHECKER_W * 5.6) / 4
    position[1] = data.GROUND_CHECKERS + 0.15
    position[2] = 0.25 + 0.04 * checker.row
  }
  // Checker is going to the black ?endhouse?
  else if (checker.col === -4) {
    position[0] = data.BOARD_W + (data.CHECKER_W * 5.6) / 4
    position[1] = data.GROUND_CHECKERS + 0.15
    position[2] = -0.825 + 0.04 * checker.row
  }
  // Quadrant 1
  else if (checker.col <= 5) {
    position[0] = data.BOARD_W - data.CHECKER_W * checker.col
    position[2] = -data.BOARD_H + data.CHECKER_H * checker.row
  }
  // Q2
  else if (checker.col <= 11) {
    position[0] = -data.BOARD_W + data.CHECKER_W * (11 - checker.col)
    position[2] = -data.BOARD_H + data.CHECKER_H * checker.row
  }
  // Q3
  else if (checker.col <= 17) {
    position[0] = -data.BOARD_W - data.CHECKER_W * (12 - checker.col)
    position[2] = data.BOARD_H - data.CHECKER_H * checker.row
  }
  // Q4
  else {
    position[0] = data.BOARD_W - data.CHECKER_W * (18 - checker.col + 5)
    position[2] = data.BOARD_H - data.CHECKER_H * checker.row
  }

  return position
}

export default getCheckerPos
