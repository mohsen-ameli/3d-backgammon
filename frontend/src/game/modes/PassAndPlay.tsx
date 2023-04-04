import { useContext, useEffect } from "react"
import { GameContext } from "../context/GameContext"
import { ExperienceProps } from "../types/Game.type"

/**
 * Pass and play game mode. User is playing with themselves (perhaps with someone else irl)
 */
const PassAndPlay = ({ started }: ExperienceProps) => {
  const { setInGame, gameMode, dice, resetOrbit } = useContext(GameContext)

  useEffect(() => {
    if (!started) return
    resetOrbit.current("board", true)
  }, [resetOrbit.current, started])

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
