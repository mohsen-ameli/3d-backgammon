import { useContext, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import useFetch from "../../components/hooks/useFetch"
import notification from "../../components/utils/Notification"
import { GameContext } from "../context/GameContext"

/**
 * A game between two friends.
 */

type DataType = {
  valid: boolean
  finished: boolean
}

const FriendGame = () => {
  const { inGame, setInGame, gameMode, resetOrbit } = useContext(GameContext)

  const navigate = useNavigate()
  const { gameId } = useParams()

  const { data: temp } = useFetch(`/api/game/valid-match/${gameId}/`)
  const data: DataType = temp

  const validateGame = () => {
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
    }
  }

  useEffect(() => {
    resetOrbit.current(inGame ? "board" : "env")
  }, [resetOrbit.current, inGame])

  useEffect(() => {
    validateGame()

    return () => {
      setInGame(false)
      gameMode.current = undefined
      resetOrbit.current("env")
    }
  }, [data])

  return <></>
}

export default FriendGame
