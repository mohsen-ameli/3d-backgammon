import { CHECKER_H } from "../data/Data"

const removeChecker = (checkers, rmChecker) => {
  // rmChecker.col = 0
  // rmChecker.row = 0
  rmChecker.removed = true

  const removed = checkers.filter((checker) => {
    if (checker.color === rmChecker.color) {
      return checker.removed
    }
  })

  console.log("removedremovedremovedremoved", removed)

  const positions = [0, 0.3 + removed.length * CHECKER_H, -0.2]
  console.log(positions)

  return positions
}

export default removeChecker
