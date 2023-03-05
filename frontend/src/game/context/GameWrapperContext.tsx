import { createContext, useRef, useState } from "react"
import { RChildren } from "../../components/children.type"
import { GameModeType, GameWrapperType } from "../types/GameWrapper.type"

export const GameWrapperContext = createContext({} as GameWrapperType)

const GameWrapperProvider = ({ children }: RChildren) => {
  // Game mode
  const gameMode = useRef<GameModeType>()

  // Whether the user is in game or not
  const [inGame, setInGame] = useState(false)

  const value = {
    inGame,
    gameMode,
    setInGame,
  }

  return (
    <GameWrapperContext.Provider value={value}>
      {children}
    </GameWrapperContext.Provider>
  )
}

export default GameWrapperProvider
