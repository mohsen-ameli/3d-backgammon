import { useContext, useEffect } from "react"
import useFetch from "../../components/hooks/useFetch"
import { GameContext } from "../context/GameContext"
import { DEFAULT_CHECKER_POSITIONS } from "../data/Data"
import { ExperienceProps, PlayerType } from "../types/Game.type"
import switchPlayers from "../utils/SwitchPlayers"

type DataType = {
  data: [string, string]
}

/**
 * Pass and play game mode. User is playing with themselves (perhaps with someone else irl)
 */
const PassAndPlay = ({ started }: ExperienceProps) => {
  const {
    setInGame,
    gameMode,
    dice,
    resetOrbit,
    userChecker,
    checkers,
    setPhase,
    setPlayers,
  } = useContext(GameContext)

  const { data }: DataType = useFetch("/api/game/get-random-name/")

  // Setting each player's info, game mode, checkers, dice, and phase.
  useEffect(() => {
    gameMode.current = "pass-and-play"
    dice.current = { dice1: 0, dice2: 0, moves: 0 }
    userChecker.current = Math.random() - 0.5 < 0 ? "white" : "black"
    checkers.current = JSON.parse(JSON.stringify(DEFAULT_CHECKER_POSITIONS))

    const me: PlayerType = {
      id: 0,
      name: data ? data[0] : "Guest",
      image: "",
      color: userChecker.current,
    }

    const enemy: PlayerType = {
      id: 1,
      name: data ? data[1] : "Guest",
      image: "",
      color: switchPlayers(userChecker.current),
    }

    setPlayers({ me, enemy })
    setPhase("initial")
    setInGame(true)
  }, [data])

  // Resetting states when user leaves the game.
  useEffect(() => {
    return () => {
      setInGame(false)
      gameMode.current = undefined
      resetOrbit.current("env")
    }
  }, [])

  // Resetting the orbit controls to lock onto the board
  useEffect(() => {
    if (!started) return
    resetOrbit.current("board", true)
  }, [resetOrbit.current, started])

  return <></>
}

export default PassAndPlay
