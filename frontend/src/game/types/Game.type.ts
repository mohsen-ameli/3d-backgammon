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

export type GameContextType = {
  nodes: NodeType
  materials: MaterialType
  players: React.MutableRefObject<PlayersType>
  winner: React.MutableRefObject<PlayerType | undefined>
  dice: React.MutableRefObject<DiceMoveType>
  userChecker: React.MutableRefObject<UserCheckerType | undefined>
  myTurn: boolean
  checkers: React.MutableRefObject<CheckerType[]>
  checkerPicked: React.MutableRefObject<boolean>
  dicePhysics: React.MutableRefObject<DicePhysics | undefined>
  newCheckerPosition: React.MutableRefObject<number | undefined>
  ws: WebSocket | undefined
  phase: PhaseType
  setPhase: React.Dispatch<React.SetStateAction<PhaseType>>
}
