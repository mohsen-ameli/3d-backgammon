// The type of a single checker
export type CheckerType = {
  id: number
  color: UserCheckerType
  col: number // <0 - 23 normal | -1 removed white checker | -2 removed black checker | -3 endbar white checker | -4 endbar black checker>
  row: number // <0 - 4>
  removed: boolean
}

// Possible checker colors
export type UserCheckerType = "black" | "white"
