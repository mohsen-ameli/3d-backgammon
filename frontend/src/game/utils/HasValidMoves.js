const hasValidMoves = (checkers, dices, color) => {
  const userCheckers = checkers.filter(
    (checker) => checker.color === color && checker.removed === true
  )

  if (color === "white") {
    // For now, only check the valid moves for the removed checkers
    // userCheckers.map(checker => {
    // })
  } else {
  }

  console.log("userChecker", userCheckers)
}

export default hasValidMoves
