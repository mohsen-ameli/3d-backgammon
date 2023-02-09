import { useContext, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"

const PassAndPlay = () => {
  const { setInGame, gameMode } = useContext(AuthContext)

  useEffect(() => {
    setInGame(true)
    gameMode.current = "pass-and-play"
  }, [])

  return <></>
}

export default PassAndPlay
