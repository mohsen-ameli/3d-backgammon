import { UserCheckerType } from "../types/Game.type"

// Literally does what it says
const switchPlayers = (current: UserCheckerType): UserCheckerType => {
  if (current === "white") {
    return "black"
  }
  return "white"
}

export default switchPlayers
