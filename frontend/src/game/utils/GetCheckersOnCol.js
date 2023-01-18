const getCheckersOnCol = (checkers, col, info) => {
  const checkersOnCol = checkers.filter((item) => item.col === col)
  const len = checkersOnCol.length

  if (len === 0) return { action: "valid", numCheckers: 0 }

  if (checkersOnCol[0].color === info.color) {
    return { action: "valid", numCheckers: len }
  } else {
    if (len === 1) {
      return { action: "remove", numCheckers: 1, rmChecker: checkersOnCol[0] }
    } else {
      return { action: "invalid", numCheckers: NaN }
    }
  }
}

export default getCheckersOnCol
