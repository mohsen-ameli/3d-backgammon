import { useContext, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import useFetch from "../../components/hooks/useFetch"
import notification from "../../components/utils/Notification"
import { GameWrapperContext } from "../context/GameWrapperContext"

/**
 * A game between two friends.
 */

type DataType = {
  valid: boolean
  finished: boolean
}

const FriendGame = () => {
  const { setInGame, gameMode } = useContext(GameWrapperContext)
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
    validateGame()

    return () => {
      setInGame(false)
      gameMode.current = undefined
    }
  }, [data])

  return <></>
}

export default FriendGame
