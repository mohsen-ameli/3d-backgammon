import { useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"

const PassAndPlay = () => {
  const { setInGame, gameMode } = useContext(AuthContext)

  useEffect(() => {
    setInGame(true)
    gameMode.current = "pass-and-play"

    return () => {
      setInGame(false)
      gameMode.current = null
    }
  }, [])

  return <></>
}

export default PassAndPlay
