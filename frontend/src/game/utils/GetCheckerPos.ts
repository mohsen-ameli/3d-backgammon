import * as data from "../data/Data"

/**
 * This function will get the position (x,y,z) of the checker on the board based on the given column and row
 * @returns An array of x, y, and z coordinates. The y (or the elavation) is the ground level
 */
const getCheckerPos = (
  col: number,
  row: number,
  removed: boolean = false
): number[] => {
  const position = []
  position[1] = data.GROUND

  // Checker is removed
  if (removed) {
    position[0] = 0
    position[1] = data.CHECKER_H + row * 0.03 - 0.05
    position[2] = col === -1 ? 0.2 : -0.2

    return position
  }

  // Checker is going to the white ?endhouse?
  if (col === -3) {
    position[0] = data.BOARD_W + (data.CHECKER_W * 5.6) / 4
    position[1] = data.GROUND + 0.15
    position[2] = 0.25 + 0.04 * row
  }
  // Checker is going to the black ?endhouse?
  else if (col === -4) {
    position[0] = data.BOARD_W + (data.CHECKER_W * 5.6) / 4
    position[1] = data.GROUND + 0.15
    position[2] = -0.825 + 0.04 * row
  }
  // Quadrant 1
  else if (col <= 5) {
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

  return position
}

export default getCheckerPos