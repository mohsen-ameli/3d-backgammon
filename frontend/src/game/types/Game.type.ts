import { CheckerType, UserCheckerType } from "./Checker.type"
import { DiceMoveType, DicePhysics } from "./Dice.type"
import { MessageType } from "./Message.type"

// Initial type
export type InitialType = {
  doneLoading: boolean
  initialLoad: boolean
}

// Each player has a type
export type PlayerType = {
  id: number
  name: string
  image: string
  color: UserCheckerType
}

// Both players
export type PlayersType = {
  me: PlayerType
  enemy: PlayerType
}

// Message type for in game messages
export type MessagesType = { userId: number; message: MessageType } | null

// The timer of active user.
// TODO: Perhaps we could merge this with PlayerType
export type TimerType = { id: number; time: number }

// Different Phases of the game
// TODO: cleanup the again phases
export type PhaseType =
  | "checkerMove"
  | "checkerMoveAgain"
  | "diceRoll"
  | "diceRollAgain"
  | "diceRollPhysics"
  | "diceSync"
  | "initial"
  | "ended"
  | "spectate"
  | "spectating"

// Different game mode types
export type GameModeType = "pass-and-play" | `friend-game_${string}` | undefined

// Function types
export type ToggleControlsType = (from: "layout" | "checkerDisable" | "checkerEnable") => void
export type ResetOrbitType = (focus: "board" | "env", isInitial?: boolean) => void

// The data that comes back from backend, when receiving updates
export type GameDataTypes = {
  too_many_users?: boolean
  finished?: boolean
  winner?: PlayerType
  resigner?: PlayerType
  message?: MessageType
  id?: number
  initial?: boolean
  black?: number
  white?: number
  black_name?: string
  white_name?: string
  white_image?: string
  black_image?: string
  player_timer?: TimerType
  turn?: UserCheckerType
  board?: CheckerType[]
  dice?: DiceMoveType
  physics?: DicePhysics
  initial_physics?: DicePhysics
}
