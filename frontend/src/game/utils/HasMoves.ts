import { useGameStore } from "../store/useGameStore"
import { UserCheckerType } from "../types/Checker.type"
import Endgame from "./Endgame"
import lenRemovedCheckers from "./LenRemovedCheckers"
import switchPlayers from "./SwitchPlayers"

// Opposite color of the checker that is requested to be checked
let oppositeColor: UserCheckerType

type NotAllowedType = { [key: number]: boolean }
type Die = "dice1" | "dice2"

/**
 * warning: Complex logic ahead, lol
 * This method does 3 things:
 * 1 - Check if there are valid moves for the removed checkers (checkRemoved function)
 * 2 - Check if user has valid moves in general (checkCheckers function):
 *     + If user is in endgame, then check if they have moves
 *     + Otherwise, check if they have any moves
 */
export default function hasMoves(): boolean {
  const color = useGameStore.getState().userChecker!

  oppositeColor = switchPlayers(color)

  // Checking for any removed checkers
  const lenRmCheckers = lenRemovedCheckers(color)

  if (lenRmCheckers === 0) {
    // There are no removed checkers.
    return checkCheckers(color)
  } else {
    // There are removed checkers. Checking if they have any valid moves
    return checkRemoved(color)
  }
}

// For checking checkers that are NOT removed
function checkCheckers(color: UserCheckerType) {
  const dice = useGameStore.getState().dice
  const checkers = useGameStore.getState().checkers

  // Variable to hold list of boolean values.
  const validMoves: boolean[] = []

  // This will have the dice numbers as keys, and the value will be true if the user has an invalid move
  const notAllowed: NotAllowedType = {}

  // Whether or not user is in the endgame
  const end = Endgame(color)

  // All of the user's checkers that are not removed NOR in the outside columns
  const userCheckers = checkers.filter(
    checker => checker.color === color && checker.removed === false && checker.col !== -3 && checker.col !== -4,
  )

  const dice_ = { dice1: dice.dice1, dice2: dice.dice2 }

  let die: Die

  // Looping through the dice
  for (die in dice_) {
    const dieNum = dice_[die]

    // If the dice number is defined
    if (dieNum !== 0) {
      // Initialize notAllowed with the number on the dice as the key and false as the value
      notAllowed[dieNum] = false

      // Looping through user's checkers
      for (const checker of userCheckers) {
        // The column the checker will be on after the dice roll
        const colToBeChecked = checker.color === "white" ? checker.col + dieNum : checker.col - dieNum

        // User has the option to move within the board
        if (colToBeChecked <= 23 && colToBeChecked >= 0) {
          // Checkers on the destination with opposite colors
          const checkerOnIndex = checkers.filter(
            checker_ => checker_.col === colToBeChecked && checker_.color === oppositeColor,
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
              backRankCheckers = checkers.filter(check => check.col > checker.col && check.color === color).length
            } else {
              backRankCheckers = checkers.filter(
                check => check.col >= 18 && check.col < checker.col && check.color === color,
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

      notAllowed[dieNum] = validMoves.every(item => item === false)
    }
  }

  // notALlowed object
  const invalidMoves = Object.values(notAllowed)

  // User has no invalid moves
  if (invalidMoves.length === 0) return true

  // If user has ONLY invalid moves
  if (invalidMoves.every(item => item === true)) return false

  // User has at least one valid move
  return true
}

// For checking checkers that ARE removed
function checkRemoved(color: UserCheckerType) {
  const dice = useGameStore.getState().dice
  const checkers = useGameStore.getState().checkers

  type checkersOnEnemyColsType = { [key: number]: number }

  // This will have the checker column number as key, and number of checkers on that column (of the enemy house columns).
  const checkersOnEnemyCols = {} as checkersOnEnemyColsType

  // This will have the dice numbers as keys, and the value will be true if the user has an invalid move
  const notAllowed = {} as NotAllowedType

  // Check if there are more than 2 checkers on the same column in the enemy house.
  // if there is, then add one to the checkersOnEnemyCols object, with the column number as the key
  for (const checker of checkers) {
    // The column number of each checker
    const colNum = checker.col + 1

    // We're only interested in the checkers in the enemy house
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

  const dice_ = { dice1: dice.dice1, dice2: dice.dice2 }

  let die: Die

  // First looping through the dice. Then looping through the checkers on the first columns (house).
  for (die in dice_) {
    const dieNum = dice_[die]

    // If the die number is defined (aka user hasn't played the die)
    if (dieNum !== 0) {
      // Initialize notAllowed with the number on the dice as the key and false as the value
      notAllowed[dieNum] = false

      // Looping through the checkers on the enemy house
      for (const colNum in checkersOnEnemyCols) {
        if (checkersOnEnemyCols[colNum] >= 2) {
          // Getting the number of the column
          const compare = color === "white" ? colNum : String(25 - parseInt(colNum))

          // One of the die allows the user to go to an invalid column
          // So notAllowed will be set to true
          if (String(dieNum) === compare) {
            notAllowed[dieNum] = true
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
  if (invalidMoves.every(item => item === true)) return false

  // User has at least one valid move
  return true
}
