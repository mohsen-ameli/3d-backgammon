import * as data from "../data/Data"

/**
 * This function will get the position (x,y,z) of the checker on the board based on the given column and row
 * @param {*} col The column of the checker
 * @param {*} row The row of the checker
 * @returns An array of x, y, and z coordinates. The y (or the elavation) is the ground level
 */
const getCheckerPos = (col, row) => {
  const position = []

  // Quadrant 1
  if (col <= 5) {
    position[0] = data.BOARD_W - data.CHECKER_W * col
    position[2] = -data.BOARD_H + data.CHECKER_H * row
  }
  // Q2
  else if (col <= 11) {
    position[0] = -data.BOARD_W + data.CHECKER_W * (11 - col)
    position[2] = -data.BOARD_H + data.CHECKER_H * row
  }
  // Q3
  else if (col <= 17) {
    position[0] = -data.BOARD_W - data.CHECKER_W * (12 - col)
    position[2] = data.BOARD_H - data.CHECKER_H * row
  }
  // Q4
  else {
    position[0] = data.BOARD_W - data.CHECKER_W * (18 - col + 5)
    position[2] = data.BOARD_H - data.CHECKER_H * row
  }

  position[1] = data.GROUND

  return position
}

export default getCheckerPos
