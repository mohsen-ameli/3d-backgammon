// The different environment maps we have
export type EnvMapType = "diamondHall" | "brilliantHall" | "finGarden"
export const EnvMap = ["diamondHall", "brilliantHall", "finGarden"]

// Settings type, used in the settings component
export type SettingsType = {
  perf: boolean
  debug: boolean
  sound: boolean
  music: boolean
  envMap: EnvMapType
  defaultVolume: number
}
