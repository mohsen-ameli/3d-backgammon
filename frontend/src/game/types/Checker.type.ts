import { UserCheckerType } from "./Game.type"

/* checkers: [
  id: number,
  color: "white" | "black",
  col: number <0 - 23 normal | -1 removed white checker | -2 removed black checker | -3 endbar white checker | -4 endbar black checker>,
  row: number <0 - 4>,
  removed: boolean
] */
export type CheckerType = {
  id: number
  color: UserCheckerType
  col: number
  row: number
  removed: boolean
}
