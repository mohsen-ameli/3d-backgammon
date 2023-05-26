import { UserCheckerType } from "../types/Checker.type"

/**
 * Literally does what it says
 */
export default function switchPlayers(current: UserCheckerType): UserCheckerType {
  return current === "white" ? "black" : "white"
}
