import Endgame from "./Endgame"
import switchPlayers from "./SwitchPlayers"

/**
 * This method does 3 things:
 * 1 - Check if there are valid moves for the removed checkers
 * 2 - Check if user has valid moves in general:
 *     + If user is in endgame, then check if they have moves
 *     + Otherwise, check if they have any moves, in general
 * @param {*} checkers
 * @param {*} dices
 * @param {*} color
 */

let oppositeColor

const hasMoves = (checkers, dices, color) => {
  oppositeColor = switchPlayers(color)

  // Checking fo any removed checkers
  const removedCheckers = checkers.filter(
    (checker) => checker.removed === true && checker.color === color
  ).length

  if (removedCheckers === 0) {
    return checkCheckers(checkers, dices, color)
  }
  // There are removed checkers. Checking if they have any valid moves
  else {
    return checkRemoved(checkers, dices, color)
  }
}

// For checking checkers that are NOT removed
const checkCheckers = (checkers, dices, color) => {
  const validMoves = []
  // This will have the dice numbers as keys, and the value will be true if the user has an invalid move
  // Example: {
  //  dice1: true,
  //  dice2: false
  // }
  const notAllowed = {}
  // Whether or not user is in the endgame
  const end = Endgame(checkers, color)

  // All of the user's checkers that are not removed NOR in the outside columns
  const userCheckers = checkers.filter(
    (checker) =>
      checker.color === color &&
      checker.removed === false &&
      checker.col !== -3 &&
      checker.col !== -4
  )

  // Looping through the dices
  for (const dice in Object.fromEntries(Object.entries(dices).slice(0, 2))) {
    // If the dice number is defined
    if (dices[dice]) {
      // Initialize notAllowed with the number on the dice as the key and false as the value
      notAllowed[dices[dice]] = false

      // Looping through user's checkers
      for (const checker of userCheckers) {
        // The column the checker will be on after the dice roll
        const colToBeChecked =
          checker.color === "white"
            ? checker.col + dices[dice]
            : checker.col - dices[dice]

        // User has the option to move within the board
        if (colToBeChecked <= 23 && colToBeChecked >= 0) {
          // Checkers on the destination with opposite colors
          const checkerOnIndex = checkers.filter(
            (checker_) =>
              checker_.col === colToBeChecked &&
              checker_.color === oppositeColor
          )

          if (checkerOnIndex.length >= 2) {
            validMoves.push(false)
          } else {
            validMoves.push(true)
          }
        }
        // User has the option to move out of the board
        else {
          // If we are in the end game for the current user
          if (end) {
            let backRankCheckers
            // Getting the number of checkers behind the current checker (inside the loop)
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

      notAllowed[dices[dice]] = validMoves.every((item) => item === false)
    }
  }

  console.log("notAllowed", notAllowed)

  // notALlowed object
  const invalidMoves = Object.values(notAllowed)

  // User has no invalid moves
  if (invalidMoves.length === 0) return true

  // If user has ONLY invalid moves
  if (invalidMoves.every((item) => item === true)) return false

  // User has at least one valid move
  return true
}

// For checking checkers that ARE removed
const checkRemoved = (checkers, dices, color) => {
  // This will have the checker column number as key, and number of checkers on that column (of the enemy house columns).
  // Example: {
  //  colNum: numCheckers,
  //  colNum: numCheckers,
  //  colNum: numCheckers
  // }
  const checkersOnEnemyCols = {}
  // This will have the dice numbers as keys, and the value will be true if the user has an invalid move
  // Example: {
  //  dice1: true,
  //  dice2: false
  // }
  const notAllowed = {}

  // Check if there are more than 2 checkers on the same column in the enemy columns (house).
  // if there is, then add one to the checkersOnEnemyCols object, with the column number as the key
  for (const checker of checkers) {
    // The column number of each checker
    const colNum = checker.col + 1

    // We're only interested in the checkers in the enemy columns (house)
    if (
      (colNum <= 6 && color === "white" && checker.color === oppositeColor) ||
      (colNum >= 19 && color === "black" && checker.color === oppositeColor)
    ) {
      if (!checkersOnEnemyCols[colNum]) {
        // New checker. Initialize the value to 1
        checkersOnEnemyCols[colNum] = 1
      } else {
        // Checker exists. Increment the value by 1
        checkersOnEnemyCols[colNum] += 1
      }
    }
  }

  // First looping through the dices. Then looping through the checkers on the first columns (house).
  for (const dice in Object.fromEntries(Object.entries(dices).slice(0, 2))) {
    // If the dice number is defined
    if (dices[dice]) {
      // Initialize notAllowed with the number on the dice as the key and false as the value
      notAllowed[dices[dice]] = false

      // Looping through the checkers on the first house (of the enemy)
      for (const colNum in checkersOnEnemyCols) {
        if (checkersOnEnemyCols[colNum] >= 2) {
          // Getting the number of the column
          const compare =
            color === "white" ? String(colNum) : String(25 - colNum)

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
  const invalidMoves = Object.values(notAllowed)

  // User has no invalid moves
  if (invalidMoves.length === 0) return true

  // If user has ONLY invalid moves
  if (invalidMoves.every((item) => item === true)) return false

  // User has at least one valid move
  return true
}

export default hasMoves
