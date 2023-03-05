export type ToggleZoomType = (newValue: boolean) => void

export type GameModeType = "pass-and-play" | string | undefined

export type GameWrapperType = {
  gameMode: React.MutableRefObject<GameModeType>

  inGame: boolean
  setInGame: React.Dispatch<React.SetStateAction<boolean>>
  toggleControls: React.MutableRefObject<(ui?: boolean, drag?: boolean) => void>
  showThrow: boolean | null
  setShowThrow: React.Dispatch<React.SetStateAction<boolean | null>>

  resetOrbit: React.MutableRefObject<() => void>
  toggleZoom: React.MutableRefObject<ToggleZoomType>
  resign: React.MutableRefObject<() => void>
  throwDice: React.MutableRefObject<() => void>
}
