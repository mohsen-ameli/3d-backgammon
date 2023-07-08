import { MaterialType, NodeType } from "./GLTFResult.type"
import { CheckerType, UserCheckerType } from "./Checker.type"
import { DiceMoveType, DicePhysics } from "./Dice.type"
import { GameModeType, InitialType, MessagesType, PhaseType, PlayerType, PlayersType, TimerType } from "./Game.type"
import { SettingsType } from "./Settings.type"
import { Song } from "./Song.type"

export type GameStoreType = {
  // Functions
  toggleControls: ((from: "layout" | "checkerDisable" | "checkerEnable") => void) | null
  resetOrbit: ((focus: "board" | "env", isInitial?: boolean) => void) | null
  resign: (winnerId: number, loserId: number, send?: boolean) => void
  throwDice: (() => void) | null
  setVolume: ((vol: number) => void) | null

  // States
  gameMode: GameModeType | null
  gameId: string | null
  userChecker: UserCheckerType | null
  winner: PlayerType | null
  dice: DiceMoveType
  dicePhysics: DicePhysics | null
  checkers: CheckerType[] | null
  checkerPicked: CheckerType | null
  timer: TimerType | null
  selectedSongs: Song[]
  messages: MessagesType | null
  ws: WebSocket | null
  initial: InitialType | null
  players: PlayersType | null
  phase: PhaseType | undefined
  settings: SettingsType
  songs: Song[]
  volume: number
  newCheckerPosition: number | null
  started: boolean
  myTurn: boolean
  inGame: boolean
  showThrow: boolean | null

  // Other
  nodes: NodeType | null
  materials: MaterialType | null
}
