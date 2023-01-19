// This method will return an object with the following properties:
// action: "valid" | "invalid" | "remove"
// numCheckers: number of checkers on the column
// rmChecker: checker object (only if action is "remove")
/**
 *
 * @param {*} checkers Current state of all checkers
 * @param {*} col The column to be checked
 * @param {*} color The color of the checker being moved
 * @returns
 */
const getCheckersOnCol = (checkers, col, color) => {
  const checkersOnCol = checkers.filter((item) => item.col === col)
  const len = checkersOnCol.length

  // If the first checker on the column is the same color as the one being moved
  if (len === 0 || checkersOnCol[0].color === color)
    return { action: "valid", numCheckers: len }

  // Then one of the checkers on this column is being removed
  if (len === 1)
    return { action: "remove", numCheckers: 1, rmChecker: checkersOnCol[0] }

  // Just an invalid move
  return { action: "invalid", numCheckers: NaN }
}

export default getCheckersOnCol
