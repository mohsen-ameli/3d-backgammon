import { useContext, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import useFetch from "../../components/hooks/useFetch"
import notification from "../../components/utils/Notification"
import getServerUrl from "../../components/utils/getServerUrl"
import { GameContext } from "../context/GameContext"
import { ExperienceProps } from "../types/Game.type"

type DataType = {
  valid: boolean
  finished: boolean
}

/**
 * A game between two friends.
 */
const FriendGame = ({ started }: ExperienceProps) => {
  const { inGame, setInGame, gameMode, resetOrbit, setWs } =
    useContext(GameContext)

  const navigate = useNavigate()
  const { gameId } = useParams()

  const { data }: { data: DataType } = useFetch(
    `/api/game/valid-match/${gameId}/`
  )

  // Checks to see if the game UUID is valid
  const isValidateGame = () => {
    if (!data || data.valid === undefined) return

    if (!data.valid) {
      navigate("/friends")
      notification("Wrong game :(", "error")
    } else if (data.finished) {
      navigate("/friends")
      notification("This game is finished :(", "error")
    } else {
      setInGame(true)
      gameMode.current = `game_${gameId}`
      return true
    }
    return false
  }

  // Validating game, and starting the game websocket
  useEffect(() => {
    if (isValidateGame()) {
      const gameId = gameMode.current?.split("_")[1]
      const url = `${getServerUrl(false)}/ws/game/${gameId}/`
      setWs(() => new WebSocket(url))
    }

    return () => {
      setInGame(false)
      gameMode.current = undefined
      resetOrbit.current("env")
    }
  }, [data])

  // Resetting the orbit controls to lock onto the board
  useEffect(() => {
    if (!started) return
    resetOrbit.current(inGame ? "board" : "env", true)
  }, [resetOrbit.current, inGame, started])

  return <></>
}

export default FriendGame
