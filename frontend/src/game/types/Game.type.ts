import { BufferGeometry, Material, Mesh, MeshStandardMaterial } from "three"
import { CheckerType } from "./Checker.type"
import { DicePhysics, DiceMoveType } from "./Dice.type"

export type UserCheckerType = "black" | "white"

export type PlayerType = { id: number; name: string; color: UserCheckerType }

export type PlayersType = {
  me: PlayerType
  enemy: PlayerType
}

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

export type ToggleZoomType = (newValue: boolean) => void

export type GameModeType = "pass-and-play" | string | undefined

export type GameContextType = {
  // Functions
  toggleControls: React.MutableRefObject<(ui?: boolean, drag?: boolean) => void>
  resetOrbit: React.MutableRefObject<() => void>
  toggleZoom: React.MutableRefObject<ToggleZoomType>
  resign: () => void
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
