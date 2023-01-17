import * as data from "../data/Data"

/**
 * This function will get the position of the checker on the board
 * @param {*} x The x coordinate of the checker
 * @param {*} y The y coordinate of the checker
 * @returns An array of x, y, and z coordinates. The y (or the elavation) is the ground level
 */
const getCheckerPos = (x, y) => {
  const position = []

  // Quadrant 1
  if (x <= 5) {
    position[0] = data.BOARD_W - data.CHECKER_W * x
    position[2] = -data.BOARD_H + data.CHECKER_H * y
  }
  // Q2
  else if (x <= 11) {
    position[0] = -data.BOARD_W + data.CHECKER_W * (11 - x)
    position[2] = -data.BOARD_H + data.CHECKER_H * y
  }
  // Q3
  else if (x <= 17) {
    position[0] = -data.BOARD_W - data.CHECKER_W * (12 - x)
    position[2] = data.BOARD_H - data.CHECKER_H * y
  }
  // Q4
  else {
    position[0] = data.BOARD_W - data.CHECKER_W * (18 - x + 5)
    position[2] = data.BOARD_H - data.CHECKER_H * y
  }

  position[1] = data.GROUND

  return position
}

export default getCheckerPos
