const hasValidMoves = (checkers, dices, color) => {
  const oppositeColor = color === "white" ? "black" : "white"

  const userCheckers = checkers.filter(
    (checker) => checker.color === color && checker.removed === true
  )

  if (userCheckers.length === 0) return true

  const checkerOnFirstHouse = {}
  const notAllowed = {}

  // Check if there are more than 2 checkers on the same column
  // if there is, then add one to the notAllowed object, with the column number as the key

  for (const checker of checkers) {
    const index = checker.col + 1

    if (
      (index <= 6 && color === "white" && checker.color === oppositeColor) ||
      (index >= 19 && color === "black" && checker.color === oppositeColor)
    ) {
      if (checkerOnFirstHouse[index] === undefined) {
        checkerOnFirstHouse[index] = 1
      } else {
        checkerOnFirstHouse[index] += 1
      }
    }
  }

  for (const dice in Object.fromEntries(Object.entries(dices).slice(0, 2))) {
    notAllowed[dices[dice]] = false
    for (const colNum in checkerOnFirstHouse) {
      if (checkerOnFirstHouse[colNum] >= 2) {
        let compare = String(colNum)
        if (color === "black") {
          compare = String(25 - colNum)
        }
        if (String(dices[dice]) === compare) {
          notAllowed[dices[dice]] = true
        }
      }
    }
  }

  const moves = Object.values(notAllowed)
  if (moves.length === 0) return true

  if (moves.every((item) => item === true)) {
    return false
  } else {
    return true
  }
}

export default hasValidMoves
