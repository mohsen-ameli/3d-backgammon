// The different environment maps we have
export type EnvMapType = "diamond_hall" | "brilliant_hall" | "fin_garden"
export const EnvMap = ["diamond_hall", "brilliant_hall", "fin_garden"]

// Settings type, used in the settings component
export type SettingsType = {
  perf: boolean
  debug: boolean
  sound: boolean
  music: boolean
  envMap: EnvMapType
}
