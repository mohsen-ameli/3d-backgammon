// The different environment maps we have
export type EnvMapType = "diamondHall" | "brilliantHall" | "finGarden"

// Settings type, used in the settings component
export type SettingsType = {
  perf: boolean
  debug: boolean
  sound: boolean
  envMap: EnvMapType
}
