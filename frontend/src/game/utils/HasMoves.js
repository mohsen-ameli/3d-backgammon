import Endgame from "./Endgame"

const hasMoves = (checkers, dices, color) => {
  const oppositeColor = color === "white" ? "black" : "white"
  const validMoves = []

  const userCheckers = checkers.filter(
    (checker) =>
      checker.color === color &&
      checker.removed === false &&
      checker.col !== -1 &&
      checker.col !== -2 &&
      checker.col !== -3 &&
      checker.col !== -4
  )

  const end = Endgame(checkers, color)

  // Looping through the dices
  for (const dice in Object.fromEntries(Object.entries(dices).slice(0, 2))) {
    if (dices[dice] !== undefined) {
      // Looping through user's checkers
      for (const checker of userCheckers) {
        // The column the checker will be in after the dice roll
        let colToBeChecked
        if (checker.color === "white") {
          colToBeChecked = checker.col + dices[dice]
        } else {
          colToBeChecked = checker.col - dices[dice]
        }

        // User has the option to move within the board
        if (colToBeChecked <= 23 && colToBeChecked >= 0) {
          const checkerOnIndex = checkers.filter(
            (checker) =>
              checker.col === colToBeChecked && checker.color === oppositeColor
          )
          if (checkerOnIndex.length >= 2) {
            validMoves.push(false)
          } else {
            validMoves.push(true)
          }
        }
        // User has the option to move out of the board
        else {
          if (end) {
            let backRankCheckers
            if (color === "black") {
              backRankCheckers = checkers.filter(
                (check) => check.col > checker.col && check.color === color
              ).length
            } else {
              backRankCheckers = checkers.filter(
                (check) =>
                  check.col >= 18 &&
                  check.col < checker.col &&
                  check.color === color
              ).length
            }

            if (backRankCheckers === 0) {
              validMoves.push(true)
            } else {
              validMoves.push(false)
            }
          } else {
            validMoves.push(false)
          }
        }
      }
    }
  }

  const moves = validMoves.filter((item) => item === true)
  if (moves.length >= 0) {
    return true
  } else {
    return false
  }
}

export default hasMoves
