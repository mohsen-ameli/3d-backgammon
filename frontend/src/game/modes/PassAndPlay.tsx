import { useContext, useEffect } from "react"
import { AuthContext } from "../../context/AuthContext"

/**
 * Pass and play game mode. User is playing with themselves (perhaps with someone else irl)
 */
const PassAndPlay = () => {
  const { setInGame, gameMode } = useContext(AuthContext)

  useEffect(() => {
    setInGame(true)
    gameMode.current = "pass-and-play"

    return () => {
      setInGame(false)
      gameMode.current = undefined
    }
  }, [])

  return <></>
}

export default PassAndPlay
