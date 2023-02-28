import { UserCheckerType } from "../types/Game.type"

/**
 * Literally does what it says
 */
const switchPlayers = (current: UserCheckerType): UserCheckerType => {
  return current === "white" ? "black" : "white"
}

export default switchPlayers
