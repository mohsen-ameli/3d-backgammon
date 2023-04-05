import { CheckerType } from "./Checker.type"
import { DiceMoveType, DicePhysics } from "./Dice.type"
import { MaterialType, NodeType } from "./GLTFResult.type"

export type ExperienceProps = {
  started: boolean
}

// The different environment maps we have
export type EnvMapType = "diamondHall" | "brilliantHall" | "finGarden"

// Settings type, used in the settings component
export type SettingsType = {
  perf: boolean
  debug: boolean
  sound: boolean
  envMap: EnvMapType
}

// Possible checker colors
export type UserCheckerType = "black" | "white"

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
export type MessageType = { userId: number; message: string } | null

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
  | undefined

// Different game mode types
export type GameModeType = "pass-and-play" | string | undefined

// Checker picked type
export type CheckerPickedType = CheckerType | null

// Initial type
export type InitialType = {
  doneLoading: boolean
  initialLoad: boolean
}

export type GameContextType = {
  // Functions
  toggleControls: React.MutableRefObject<
    (from: "layout" | "checkerDisable" | "checkerEnable") => void
  >
  resetOrbit: React.MutableRefObject<
    (focus: "board" | "env", isInitial?: boolean) => void
  >
  resign: (winnerId: number, loserId: number, send?: boolean) => void
  throwDice: React.MutableRefObject<() => void>

  // Refs
  gameMode: React.MutableRefObject<GameModeType>
  userChecker: React.MutableRefObject<UserCheckerType | undefined>
  winner: React.MutableRefObject<PlayerType | undefined>
  dice: React.MutableRefObject<DiceMoveType>
  dicePhysics: React.MutableRefObject<DicePhysics | undefined>
  checkers: React.MutableRefObject<CheckerType[]>
  checkerPicked: React.MutableRefObject<CheckerPickedType>
  newCheckerPosition: React.MutableRefObject<number | undefined>
  timer: React.MutableRefObject<TimerType | undefined>

  // States
  myTurn: boolean
  messages: MessageType | null
  ws: WebSocket | undefined
  initial: InitialType
  players: PlayersType | undefined
  inGame: boolean
  showThrow: boolean | null
  phase: PhaseType
  settings: SettingsType

  // SetStates
  setWs: React.Dispatch<React.SetStateAction<WebSocket | undefined>>
  setInitial: React.Dispatch<React.SetStateAction<InitialType>>
  setPlayers: React.Dispatch<React.SetStateAction<PlayersType | undefined>>
  setInGame: React.Dispatch<React.SetStateAction<boolean>>
  setShowThrow: React.Dispatch<React.SetStateAction<boolean | null>>
  setPhase: React.Dispatch<React.SetStateAction<PhaseType>>
  setSettings: React.Dispatch<React.SetStateAction<SettingsType>>

  // Other
  nodes: NodeType
  materials: MaterialType
}

// The data that comes back from backend, when receiving updates
export type GameDataTypes = {
  too_many_users?: boolean
  finished?: boolean
  winner?: PlayerType
  resigner?: PlayerType
  message?: string
  user_id?: number
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
