import { useContext, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import useAxios from "../components/hooks/useAxios"
import notification from "../components/utils/Notification"

const FriendGame = () => {
  const { gameId } = useParams()
  const { setInGame, gameMode } = useContext(AuthContext)
  const axiosInstance = useAxios()
  const navigate = useNavigate()

  const validateGame = async () => {
    const res = await axiosInstance.get(`/api/game/valid-match/${gameId}`)

    if (res.status !== 200) return

    if (!res.data.valid) {
      navigate("/friends")
      notification("Wrong game :(", "error")
    } else if (res.data.finished) {
      navigate("/friends")
      notification("This game is finished :(", "error")
    } else {
      setInGame(true)
      gameMode.current = `friend-game-${gameId}`
    }
  }

  useEffect(() => {
    validateGame()
  }, [])

  return <></>
}

export default FriendGame
