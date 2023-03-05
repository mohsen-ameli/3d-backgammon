export type GameModeType = "pass-and-play" | string | undefined

export type GameWrapperType = {
  gameMode: React.MutableRefObject<GameModeType>
  inGame: boolean
  setInGame: React.Dispatch<React.SetStateAction<boolean>>
}
