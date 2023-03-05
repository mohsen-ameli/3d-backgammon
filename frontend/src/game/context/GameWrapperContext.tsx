import { createContext, useRef, useState } from "react"
import { RChildren } from "../../components/children.type"
import { GameModeType, GameWrapperType } from "../types/GameWrapper.type"

export const GameWrapperContext = createContext({} as GameWrapperType)

const GameWrapperProvider = ({ children }: RChildren) => {
  // Game mode
  const gameMode = useRef<GameModeType>()

  // Whether the user is in game
  const [inGame, setInGame] = useState(false)

  // Whether to show the throw button
  const [showThrow, setShowThrow] = useState<boolean | null>(false)

  // Orbit control functions. Defined in the Controls component
  const resetOrbit = useRef(() => null)
  const toggleControls = useRef(() => null)
  const toggleZoom = useRef(() => null)

  // Resigns the user. Defined in UI
  const resign = useRef(() => null)

  // Throws the dice onto the board. Defined in Dices
  const throwDice = useRef(() => null)

  const value = {
    inGame,
    gameMode,
    setInGame,
    toggleControls,
    resetOrbit,
    toggleZoom,
    resign,
    throwDice,
    showThrow,
    setShowThrow,
  }

  return (
    <GameWrapperContext.Provider value={value}>
      {children}
    </GameWrapperContext.Provider>
  )
}

export default GameWrapperProvider
