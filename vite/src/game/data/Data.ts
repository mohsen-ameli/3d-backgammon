import { Quaternion, Vector3 } from "three"
import { CheckerType } from "../types/Checker.type"
import { EnvMap, EnvMapType, SettingsType } from "../types/Settings.type"

// User turn duration (Synced with backend in settings.py)
export const USER_TURN_DURATION = 70

// Message cool-down for in game messages (in milliseconds)
export const MESSAGE_COOLDOWN = 5000

// Settings
const getDefaultEnvMap = (): EnvMapType => {
  const env = localStorage.getItem("settingsEnv")

  if (env !== null && EnvMap.includes(env)) {
    return env as EnvMapType
  } else {
    return "diamondHall"
  }
}

export const DEFAULT_SETTINGS: SettingsType = {
  perf: false,
  debug: false,
  sound: true,
  music: true,
  envMap: getDefaultEnvMap(),
  defaultVolume: 0.25,
}

// Stage
export const DEFAULT_ENV_MAP_INTENSITY = 2

// Columns
export const COLUMN_HOVER_COLOR = "red"

// Dice
export const DICE_MASS = 0.2
export const DICE_BOUNCINESS = 0.9
export const DICE_FRICTION = 0.4
export const DICE_1_DEFAULT_POS = new Vector3(0, 0.55, 2)
export const DICE_2_DEFAULT_POS = new Vector3(0.1, 0.55, 2)
export const DEFAULT_DICE_QUATERNION = new Quaternion(
  0.00048353226156905293,
  0.005327336024492979,
  -0.00011967308091698214,
  0.9999856352806091
)

// Checkers
export const TOTAL_CHECKERS = 8
export const CHECKER_W = 0.184
export const CHECKER_H = 0.155
export const CHECKER_HALF = CHECKER_W / 2

// Board
export const GROUND = -0.2
export const GROUND_CHECKERS = GROUND + -0.058 // Ground level (y coordinate)
export const BOARD_W = 1.17148 - CHECKER_HALF
export const BOARD_H = 0.855

// Camera
export const ORIGINAL_CAMERA_POSITION = { x: 6, y: 1.32, z: -7 }
export const ORIGINAL_CAMERA_QUATERNION = {
  x: -0.02464842552311772,
  y: 0.9355151553202544,
  z: 0.06663103892908007,
  w: 0.3460695796174276,
}
export const DEFAULT_CAMERA_POSITION = { x: 0, y: 2.5, z: 0 }
export const DEFAULT_CAMERA_TARGET = { x: 0, y: 0, z: 0 }
export const DEFAULT_CAMERA_QUATERNION = {
  x: -0.7071064276330685,
  y: 0,
  z: 0,
  w: 0.7071071347398497,
}

// Default checker positions
const DEFAULT_POS: CheckerType[] = [
  { id: 0, color: "white", col: 0, row: 0, removed: false },
  { id: 1, color: "white", col: 0, row: 1, removed: false },
  { id: 2, color: "white", col: 11, row: 0, removed: false },
  { id: 3, color: "white", col: 11, row: 1, removed: false },
  { id: 4, color: "white", col: 11, row: 2, removed: false },
  { id: 5, color: "white", col: 11, row: 3, removed: false },
  { id: 6, color: "white", col: 11, row: 4, removed: false },
  { id: 7, color: "white", col: 16, row: 0, removed: false },
  { id: 8, color: "white", col: 16, row: 1, removed: false },
  { id: 9, color: "white", col: 16, row: 2, removed: false },
  { id: 10, color: "white", col: 18, row: 0, removed: false },
  { id: 11, color: "white", col: 18, row: 1, removed: false },
  { id: 12, color: "white", col: 18, row: 2, removed: false },
  { id: 13, color: "white", col: 18, row: 3, removed: false },
  { id: 14, color: "white", col: 18, row: 4, removed: false },

  { id: 15, color: "black", col: 23, row: 0, removed: false },
  { id: 16, color: "black", col: 23, row: 1, removed: false },
  { id: 17, color: "black", col: 12, row: 0, removed: false },
  { id: 18, color: "black", col: 12, row: 1, removed: false },
  { id: 19, color: "black", col: 12, row: 2, removed: false },
  { id: 20, color: "black", col: 12, row: 3, removed: false },
  { id: 21, color: "black", col: 12, row: 4, removed: false },
  { id: 22, color: "black", col: 7, row: 0, removed: false },
  { id: 23, color: "black", col: 7, row: 1, removed: false },
  { id: 24, color: "black", col: 7, row: 2, removed: false },
  { id: 25, color: "black", col: 5, row: 0, removed: false },
  { id: 26, color: "black", col: 5, row: 1, removed: false },
  { id: 27, color: "black", col: 5, row: 2, removed: false },
  { id: 28, color: "black", col: 5, row: 3, removed: false },
  { id: 29, color: "black", col: 5, row: 4, removed: false },
]

export const DEFAULT_CHECKER_POSITIONS =
  process.env.NODE_ENV === "development" ? DEFAULT_POS : DEFAULT_POS

/**
 * If we are in training dice mode
 * @deprecated
 */
export const TRAINING_DICE_MODE =
  process.env.NODE_ENV === "development" ? false : false