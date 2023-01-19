/**
 * @param {*} checkers Current state of all checkers
 * @param {*} color The color of the checker's column to be counted
 * @returns Returns the length of removed checkers of a given color
 */
const lenRemovedCheckers = (checkers, color) => {
  const removed = checkers.filter((checker) => {
    if (checker.color === color) {
      return checker.removed
    }
    return null
  })

  return removed.length
}

export default lenRemovedCheckers
