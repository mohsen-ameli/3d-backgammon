import { BufferGeometry, Material, Mesh, MeshStandardMaterial } from "three"
import { CheckerType } from "./Checker.type"
import { DicePhysics, DiceType } from "./Dice.type"

export type UserCheckerType = "black" | "white"

export type PlayerType = { id: number; name: string; color: UserCheckerType }

export type PlayersType = {
  me: PlayerType
  enemy: PlayerType
}

export type GameDataTypes = {
  too_many_users?: boolean
  finished?: boolean
  winner?: UserCheckerType
  message?: string
  user?: string
  initial?: boolean
  black?: number
  white?: number
  black_name?: string
  white_name?: string
  turn?: UserCheckerType
  board?: CheckerType[]
  dice?: DiceType
  physics?: DicePhysics
  initial_physics?: DicePhysics
}

export type NodeType = Record<
  string,
  Mesh<BufferGeometry, Material | Material[]>
>
export type MaterialType = Record<string, MeshStandardMaterial>

export type ToggleZoomType = (newValue: boolean) => void

export type GameStateType = {
  nodes: NodeType
  materials: MaterialType
  players: React.MutableRefObject<PlayersType>
  dice: React.MutableRefObject<DiceType>
  userChecker: React.MutableRefObject<UserCheckerType | undefined>
  myTurn: boolean
  checkers: React.MutableRefObject<CheckerType[]>
  checkerPicked: React.MutableRefObject<boolean>
  dicePhysics: React.MutableRefObject<DicePhysics | undefined>
  newCheckerPosition: React.MutableRefObject<number | undefined>
  ws: WebSocket | undefined
  phase: string | undefined
  setPhase: React.Dispatch<React.SetStateAction<string | undefined>>
  toggleControls: React.MutableRefObject<(ui?: boolean, drag?: boolean) => void>
  resetOrbit: React.MutableRefObject<() => void>
  toggleZoom: React.MutableRefObject<ToggleZoomType>
}
