import { useContext } from "react"
import { Link } from "react-router-dom"
import { GameContext } from "../../context/GameContext"
import ChatButton from "../components/ChatButton"
import LayoutBtn from "../components/LayoutBtn"

/**
 * Set of buttons on the top right corner
 */
const TopRightLayout = () => {
  const { resign, gameMode, players, inGame } = useContext(GameContext)

  if (!inGame) return <></>

  const resignMe = () => players && resign(players.enemy.id, players.me.id)

  return (
    <div className="absolute right-8 top-0 z-[17] flex items-center justify-center gap-x-1 p-1 lg:right-0 lg:gap-x-2 lg:p-2">
      {gameMode.current !== "pass-and-play" && <ChatButton />}

      {gameMode.current === "pass-and-play" ? (
        <Link to="/">
          <LayoutBtn title="Exit">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </LayoutBtn>
        </Link>
      ) : (
        <LayoutBtn title="Resign" onClick={resignMe}>
          <i className="fa-regular fa-flag -rotate-[20deg]"></i>
        </LayoutBtn>
      )}
    </div>
  )
}

export default TopRightLayout
