import { useContext, useEffect } from "react"
import { GameContext } from "../context/GameContext"

/**
 * Pass and play game mode. User is playing with themselves (perhaps with someone else irl)
 */
const PassAndPlay = () => {
  const { setInGame, gameMode, dice, resetOrbit } = useContext(GameContext)

  useEffect(() => {
    resetOrbit.current("board")
  }, [resetOrbit.current])

  useEffect(() => {
    setInGame(true)
    gameMode.current = "pass-and-play"
    dice.current = { dice1: 0, dice2: 0, moves: 0 }

    return () => {
      setInGame(false)
      gameMode.current = undefined
      resetOrbit.current("env")
    }
  }, [])

  return <></>
}

export default PassAndPlay
