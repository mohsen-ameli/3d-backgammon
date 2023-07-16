import { Quaternion, Vector3 } from "three"
import { EnvMap, EnvMapType, SettingsType } from "../types/Settings.type"
import { BLACK_ALMOST_WON, DEFAULT_POS, LOTS_OF_REMOVABLES, TWO_REMOVED, WHITE_ALMOST_WON } from "./CheckerPositions"
import { WHITE_HOUSE_FULL } from "./CheckerPositions"

export const ITEMS_TO_LOAD = 21

export const DEFAULT_SONG = { name: "Shuffle", src: "", song: null }

// User turn duration (Synced with backend in settings.py)
export const USER_TURN_DURATION = 70

// Message cool-down for in game messages (in milliseconds)
export const MESSAGE_COOLDOWN = 5000

// Settings
function getDefaultEnvMap(): EnvMapType {
  const env = typeof window !== "undefined" && localStorage.getItem("settingsEnv")

  if (env && EnvMap.includes(env)) {
    return env as EnvMapType
  } else {
    return "diamond_hall"
  }
}

export const DEFAULT_SETTINGS: SettingsType = {
  perf: false,
  debug: false,
  sound: true,
  music: true,
  envMap: getDefaultEnvMap(),
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
  0.9999856352806091,
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

export const DEFAULT_CHECKER_POSITIONS = process.env.NODE_ENV === "development" ? DEFAULT_POS : DEFAULT_POS

/**
 * If we are in training dice mode
 * @deprecated
 */
export const TRAINING_DICE_MODE = process.env.NODE_ENV === "development" ? false : false
