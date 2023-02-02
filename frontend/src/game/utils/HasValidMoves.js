/**
 * This method is for when the user has checkers removed and wants to
 * move them back to the board. If they have any valid moves, then
 * this method will return true, otherwise it will return false.
 * @param {*} checkers Reference to the checkers array
 * @param {*} dices Reference to the dices array
 * @param {*} color The color of the checker to be checked
 * @returns boolean
 */
const hasValidMoves = (checkers, dices, color) => {
  const oppositeColor = color === "white" ? "black" : "white"

  const userCheckers = checkers.filter(
    (checker) => checker.color === color && checker.removed === true
  )

  if (userCheckers.length === 0) return true

  // This will have the checker column number as key, and number of checkers on that column (of the enemy house columns).
  // Example: {
  //  checkerCol: numOfCheckers,
  //  0: 3,
  // }
  const checkerOnFirstHouse = {}
  // This will have the dice numbers as keys, and the value will be true if the user has an invalid move
  const notAllowed = {}

  // Check if there are more than 2 checkers on the same column in the enemy house.
  // if there is, then add one to the checkerOnFirstHouse object, with the column number as the key
  for (const checker of checkers) {
    // The column number of each checker
    const colNum = checker.col + 1

    // We're only interested in the checker in the enemy house
    if (
      (colNum <= 6 && color === "white" && checker.color === oppositeColor) ||
      (colNum >= 19 && color === "black" && checker.color === oppositeColor)
    ) {
      if (checkerOnFirstHouse[colNum] === undefined) {
        // New checker. Initialize the value to 1
        checkerOnFirstHouse[colNum] = 1
      } else {
        // Checker exists. Increment the value by 1
        checkerOnFirstHouse[colNum] += 1
      }
    }
  }

  // First looping through the dices. Then looping through the checkers on the first house.
  //
  for (const dice in Object.fromEntries(Object.entries(dices).slice(0, 2))) {
    // If the number on the dice is not undefined
    if (dices[dice]) {
      // Initialize notAllowed with the number on the dice as the key and true as the value
      notAllowed[dices[dice]] = false
      // Looping through the checkers on the first house (of the enemy)
      for (const colNum in checkerOnFirstHouse) {
        if (checkerOnFirstHouse[colNum] >= 2) {
          // Getting the number of the column
          let compare = String(colNum)
          if (color === "black") {
            compare = String(25 - colNum)
          }
          // One of the dices allows the user to go to an invalid column
          // So notAllowed will be set to true
          if (String(dices[dice]) === compare) {
            notAllowed[dices[dice]] = true
          }
        }
      }
    }
  }

  // notALlowed object
  const moves = Object.values(notAllowed)

  // User has no invalid moves
  if (moves.length === 0) return true

  if (moves.every((item) => item === true)) {
    // User only has invalid moves
    return false
  } else {
    // User has at least one valid move
    return true
  }
}

export default hasValidMoves
