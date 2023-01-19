const lenRemovedCheckers = (checkers, color) => {
  const removed = checkers.filter((checker) => {
    if (checker.color === color) {
      return checker.removed
    }
    return
  })

  return removed.length
}

export default lenRemovedCheckers
