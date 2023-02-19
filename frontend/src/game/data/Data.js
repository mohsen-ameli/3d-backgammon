// Columns
export const COLOUMN_HOVER_COLOR = "red"

// Dice
export const DICE_MASS = 0.2
export const DICE_BOUNCINESS = 0.9
export const DICE_FRICTION = 0.4
export const DICE_1_DEFAULT_POS = [0, 1, 2]
export const DICE_2_DEFAULT_POS = [0.1, 1, 2]

// Checkers
export const TOTAL_CHECKERS = 8
export const CHECKER_W = 0.184
export const CHECKER_H = 0.16
export const CHECKER_HALF = CHECKER_W / 2

// Board
export const GROUND = -0.058 // Ground level (y coordinate)
export const BOARD_W = 1.17148 - CHECKER_HALF
export const BOARD_H = 0.855

// Default orbit controls
export const DEFAULT_ORBIT_POSITION = {
  x: 0,
  y: 3,
  z: 0,
}

export const DEFAULT_ORBIT_TARGET = {
  x: 0,
  y: 0,
  z: 0,
}

export const DEFAULT_ORBIT_QUATERNION = {
  x: -0.7071064276330685,
  y: 0,
  z: 0,
  w: 0.7071071347398497,
}

// Default checker positions
const DEFAULT_POS = [
  { id: 0, color: "white", col: 0, row: 0, removed: false },
  { id: 1, color: "white", col: 0, row: 1, removed: false },
  { id: 2, color: "white", col: 11, row: 0, removed: false },
  { id: 3, color: "white", col: 11, row: 1, removed: false },
  { id: 4, color: "white", col: 11, row: 2, removed: false },
  { id: 5, color: "white", col: 11, row: 3, removed: false },
  { id: 6, color: "white", col: 11, row: 4, removed: false },
  { id: 7, color: "white", col: 16, row: 0, removed: false },
  { id: 8, color: "white", col: 16, row: 1, removed: false },
  { id: 9, color: "white", col: 16, row: 2, removed: false },
  { id: 10, color: "white", col: 18, row: 0, removed: false },
  { id: 11, color: "white", col: 18, row: 1, removed: false },
  { id: 12, color: "white", col: 18, row: 2, removed: false },
  { id: 13, color: "white", col: 18, row: 3, removed: false },
  { id: 14, color: "white", col: 18, row: 4, removed: false },

  { id: 15, color: "black", col: 23, row: 0, removed: false },
  { id: 16, color: "black", col: 23, row: 1, removed: false },
  { id: 17, color: "black", col: 12, row: 0, removed: false },
  { id: 18, color: "black", col: 12, row: 1, removed: false },
  { id: 19, color: "black", col: 12, row: 2, removed: false },
  { id: 20, color: "black", col: 12, row: 3, removed: false },
  { id: 21, color: "black", col: 12, row: 4, removed: false },
  { id: 22, color: "black", col: 7, row: 0, removed: false },
  { id: 23, color: "black", col: 7, row: 1, removed: false },
  { id: 24, color: "black", col: 7, row: 2, removed: false },
  { id: 25, color: "black", col: 5, row: 0, removed: false },
  { id: 26, color: "black", col: 5, row: 1, removed: false },
  { id: 27, color: "black", col: 5, row: 2, removed: false },
  { id: 28, color: "black", col: 5, row: 3, removed: false },
  { id: 29, color: "black", col: 5, row: 4, removed: false },
]

const LOTS_OF_REMOVABLES = [
  { id: 0, color: "white", col: 0, row: 0, removed: false },
  { id: 1, color: "white", col: 0, row: 1, removed: false },
  { id: 2, color: "white", col: 18, row: 0, removed: false },
  { id: 3, color: "white", col: 19, row: 0, removed: false },
  { id: 4, color: "white", col: 20, row: 0, removed: false },
  { id: 5, color: "white", col: 21, row: 0, removed: false },
  { id: 6, color: "white", col: 22, row: 0, removed: false },
  { id: 7, color: "white", col: 17, row: 0, removed: false },
  { id: 8, color: "white", col: 16, row: 5, removed: false },
  { id: 9, color: "white", col: 16, row: 6, removed: false },
  { id: 10, color: "white", col: 16, row: 0, removed: false },
  { id: 11, color: "white", col: 16, row: 1, removed: false },
  { id: 12, color: "white", col: 16, row: 2, removed: false },
  { id: 13, color: "white", col: 16, row: 3, removed: false },
  { id: 14, color: "white", col: 16, row: 4, removed: false },

  { id: 15, color: "black", col: 2, row: 0, removed: false },
  { id: 16, color: "black", col: 3, row: 0, removed: false },
  { id: 17, color: "black", col: 4, row: 0, removed: false },
  { id: 18, color: "black", col: 5, row: 0, removed: false },
  { id: 19, color: "black", col: 7, row: 0, removed: false },
  { id: 20, color: "black", col: 7, row: 1, removed: false },
  { id: 21, color: "black", col: 7, row: 2, removed: false },
  { id: 22, color: "black", col: 7, row: 3, removed: false },
  { id: 23, color: "black", col: 7, row: 4, removed: false },
  { id: 24, color: "black", col: 7, row: 5, removed: false },
  { id: 25, color: "black", col: 7, row: 6, removed: false },
  { id: 26, color: "black", col: 6, row: 0, removed: false },
  { id: 27, color: "black", col: 1, row: 0, removed: false },
  { id: 28, color: "black", col: 23, row: 0, removed: false },
  { id: 29, color: "black", col: 23, row: 1, removed: false },
]

const NO_MOVES_REMOVED = [
  { id: 0, color: "white", col: 10, row: 0, removed: false },
  { id: 1, color: "white", col: 10, row: 1, removed: false },
  { id: 2, color: "white", col: 18, row: 0, removed: false },
  { id: 3, color: "white", col: 18, row: 1, removed: false },
  { id: 4, color: "white", col: 19, row: 0, removed: false },
  { id: 5, color: "white", col: 19, row: 1, removed: false },
  { id: 6, color: "white", col: 20, row: 0, removed: false },
  { id: 7, color: "white", col: 20, row: 1, removed: false },
  { id: 8, color: "white", col: 21, row: 1, removed: false },
  { id: 9, color: "white", col: 21, row: 0, removed: false },
  { id: 10, color: "white", col: 22, row: 0, removed: false },
  { id: 11, color: "white", col: 22, row: 1, removed: false },
  { id: 12, color: "white", col: 23, row: 0, removed: false },
  { id: 13, color: "white", col: 23, row: 1, removed: false },
  { id: 14, color: "white", col: 23, row: 2, removed: false },

  { id: 15, color: "black", col: -2, row: 0, removed: true },
  { id: 16, color: "black", col: 3, row: 0, removed: false },
  { id: 17, color: "black", col: 4, row: 0, removed: false },
  { id: 18, color: "black", col: 5, row: 0, removed: false },
  { id: 19, color: "black", col: 7, row: 0, removed: false },
  { id: 20, color: "black", col: 7, row: 1, removed: false },
  { id: 21, color: "black", col: 7, row: 2, removed: false },
  { id: 22, color: "black", col: 7, row: 3, removed: false },
  { id: 23, color: "black", col: 7, row: 4, removed: false },
  { id: 24, color: "black", col: 7, row: 5, removed: false },
  { id: 25, color: "black", col: 7, row: 6, removed: false },
  { id: 26, color: "black", col: 7, row: 7, removed: false },
  { id: 27, color: "black", col: 7, row: 8, removed: false },
  { id: 28, color: "black", col: 6, row: 0, removed: false },
  { id: 29, color: "black", col: 1, row: 0, removed: false },
]

const REMOVABLES_EVERYWHERE = [
  { id: 0, color: "white", col: 0, row: 0, removed: false },
  { id: 1, color: "white", col: 0, row: 1, removed: false },
  { id: 2, color: "white", col: 18, row: 0, removed: false },
  { id: 3, color: "white", col: 10, row: 0, removed: false },
  { id: 4, color: "white", col: 19, row: 0, removed: false },
  { id: 5, color: "white", col: 10, row: 1, removed: false },
  { id: 6, color: "white", col: 20, row: 0, removed: false },
  { id: 7, color: "white", col: 10, row: 2, removed: false },
  { id: 8, color: "white", col: 21, row: 0, removed: false },
  { id: 9, color: "white", col: 10, row: 3, removed: false },
  { id: 10, color: "white", col: 22, row: 0, removed: false },
  { id: 11, color: "white", col: 10, row: 4, removed: false },
  { id: 12, color: "white", col: 17, row: 0, removed: false },
  { id: 13, color: "white", col: 10, row: 5, removed: false },
  { id: 14, color: "white", col: 10, row: 6, removed: false },

  { id: 15, color: "black", col: 23, row: 0, removed: false },
  { id: 16, color: "black", col: 23, row: 1, removed: false },
  { id: 17, color: "black", col: 5, row: 0, removed: false },
  { id: 18, color: "black", col: 4, row: 0, removed: false },
  { id: 19, color: "black", col: 3, row: 0, removed: false },
  { id: 20, color: "black", col: 2, row: 0, removed: false },
  { id: 21, color: "black", col: 1, row: 0, removed: false },
  { id: 22, color: "black", col: 6, row: 0, removed: false },
  { id: 23, color: "black", col: 13, row: 0, removed: false },
  { id: 24, color: "black", col: 13, row: 1, removed: false },
  { id: 25, color: "black", col: 13, row: 2, removed: false },
  { id: 26, color: "black", col: 13, row: 3, removed: false },
  { id: 27, color: "black", col: 13, row: 4, removed: false },
  { id: 28, color: "black", col: 13, row: 5, removed: false },
  { id: 29, color: "black", col: 13, row: 6, removed: false },
]

const WHITE_ALMOST_WON = [
  { id: 0, color: "white", col: -3, row: 0, removed: false },
  { id: 1, color: "white", col: -3, row: 1, removed: false },
  { id: 2, color: "white", col: -3, row: 2, removed: false },
  { id: 3, color: "white", col: -3, row: 3, removed: false },
  { id: 4, color: "white", col: -3, row: 4, removed: false },
  { id: 5, color: "white", col: -3, row: 5, removed: false },
  { id: 6, color: "white", col: -3, row: 6, removed: false },
  { id: 7, color: "white", col: -3, row: 7, removed: false },
  { id: 8, color: "white", col: -3, row: 8, removed: false },
  { id: 9, color: "white", col: -3, row: 9, removed: false },
  { id: 10, color: "white", col: -3, row: 10, removed: false },
  { id: 11, color: "white", col: -3, row: 11, removed: false },
  { id: 12, color: "white", col: -3, row: 12, removed: false },
  { id: 13, color: "white", col: -3, row: 13, removed: false },
  { id: 14, color: "white", col: 23, row: 0, removed: false },

  { id: 15, color: "black", col: 22, row: 0, removed: false },
  { id: 16, color: "black", col: 22, row: 1, removed: false },
  { id: 17, color: "black", col: 5, row: 0, removed: false },
  { id: 18, color: "black", col: 4, row: 0, removed: false },
  { id: 19, color: "black", col: 3, row: 0, removed: false },
  { id: 20, color: "black", col: 2, row: 0, removed: false },
  { id: 21, color: "black", col: 1, row: 0, removed: false },
  { id: 22, color: "black", col: 6, row: 0, removed: false },
  { id: 23, color: "black", col: 13, row: 0, removed: false },
  { id: 24, color: "black", col: 13, row: 1, removed: false },
  { id: 25, color: "black", col: 13, row: 2, removed: false },
  { id: 26, color: "black", col: 13, row: 3, removed: false },
  { id: 27, color: "black", col: 13, row: 4, removed: false },
  { id: 28, color: "black", col: 13, row: 5, removed: false },
  { id: 29, color: "black", col: 13, row: 6, removed: false },
]

export const DEFAULT_CHECKER_POSITIONS = DEFAULT_POS
