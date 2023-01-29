const GameWon = (checkers, color) => {
  const checkers1 = checkers.filter((checker) => checker.color === color)

  let checkers2 = []
  if (color === "white") {
    checkers2 = checkers1.filter((checker) => checker.col === -3)
  } else {
    checkers2 = checkers1.filter((checker) => checker.col === -4)
  }

  if (checkers2.length === 15) {
    return true
  }
  return false
}

export default GameWon
