import { useContext, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import useFetch from "../components/hooks/useFetch"
import notification from "../components/utils/Notification"

const FriendGame = () => {
  const { gameId } = useParams()
  const { setInGame, gameMode } = useContext(AuthContext)
  const { data } = useFetch(`/api/game/valid-match/${gameId}/`)
  const navigate = useNavigate()

  const validateGame = () => {
    if (data.valid === undefined) return

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
      gameMode.current = null
    }
  }, [data])

  return <></>
}

export default FriendGame
