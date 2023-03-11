import { BufferGeometry, Material, Mesh, MeshStandardMaterial } from "three"
import { CheckerType } from "./Checker.type"
import { DicePhysics, DiceMoveType } from "./Dice.type"

export type SettingsType = {
  sound: boolean
}

export type EnvMap = "diamondHall" | "briliantHall" | "finGarden"

export type UserCheckerType = "black" | "white"

export type PlayerType = {
  id: number
  name: string
  image: string
  color: UserCheckerType
}

export type PlayersType = {
  me: PlayerType
  enemy: PlayerType
}

export type TimerType = { id: number; time: number }

export type GameDataTypes = {
  too_many_users?: boolean
  finished?: boolean
  winner?: PlayerType
  resigner?: PlayerType
  message?: string
  user?: string
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

export type NodeType = Record<
  string,
  Mesh<BufferGeometry, Material | Material[]>
>
export type MaterialType = Record<string, MeshStandardMaterial>

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

export type GameModeType = "pass-and-play" | string | undefined

export type GameContextType = {
  // Functions
  toggleControls: React.MutableRefObject<
    (from: "layout" | "checkerDisable" | "checkerEnable") => void
  >
  resetOrbit: React.MutableRefObject<() => void>
  resign: (winnerId: number, loserId: number, send?: boolean) => void
  throwDice: React.MutableRefObject<() => void>

  // Refs
  gameMode: React.MutableRefObject<GameModeType>
  userChecker: React.MutableRefObject<UserCheckerType | undefined>
  players: React.MutableRefObject<PlayersType>
  winner: React.MutableRefObject<PlayerType | undefined>
  dice: React.MutableRefObject<DiceMoveType>
  dicePhysics: React.MutableRefObject<DicePhysics | undefined>
  checkers: React.MutableRefObject<CheckerType[]>
  checkerPicked: React.MutableRefObject<boolean>
  newCheckerPosition: React.MutableRefObject<number | undefined>
  timer: React.MutableRefObject<TimerType | undefined>
  settings: React.MutableRefObject<SettingsType>

  // States
  myTurn: boolean
  ws: WebSocket | undefined
  inGame: boolean
  setInGame: React.Dispatch<React.SetStateAction<boolean>>
  showThrow: boolean | null
  setShowThrow: React.Dispatch<React.SetStateAction<boolean | null>>
  phase: PhaseType
  setPhase: React.Dispatch<React.SetStateAction<PhaseType>>

  // Other
  nodes: NodeType
  materials: MaterialType
}
