import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import useFetch from "../../components/hooks/useFetch"
import { ProfileData } from "../../components/types/Profile.type"
import { GameContext } from "../context/GameContext"
import { TRAINING_DICE_MODE } from "../data/Data"
import ChatButton from "./ChatButton"
import DiceTraining from "./DiceTraining"
import LayoutBtn from "./LayoutBtn"
import SidePanel from "./SidePanel"
import TopLeftLayout from "./TopLeftLayout"
import WinnerOverlay from "./WinnerOverlay"

/**
 * The main layout of the game. Includes buttons and side panels for each user.
 */
const Layout = () => {
  const { inGame } = useContext(GameContext)

  if (!inGame)
    return (
      <>
        <TopLeftLayout />
        <WinnerOverlay />
      </>
    )

  return (
    <>
      {TRAINING_DICE_MODE && <DiceTraining />}
      <TopLeftLayout />
      <TopRightLayout />
      <MainLayout />
    </>
  )
}

const MainLayout = () => {
  const { gameMode, players } = useContext(GameContext)

  // Getting user image
  const { data }: ProfileData = useFetch("/api/get-user-profile/")
  const [img, setImg] = useState("")
  useEffect(() => setImg(data?.image), [data])

  // prettier-ignore
  if (gameMode.current === "pass-and-play") {
    return (
      <>
        <SidePanel img="" player={players?.me} sideType="me" />
        <SidePanel img="" player={players?.enemy} sideType="enemy" />
      </>
    )
  } else {
    return (
      <>
        <SidePanel img={img} player={players?.me} sideType="me" />
        <SidePanel img={players?.enemy.image} player={players?.enemy} sideType="enemy" />
      </>
    )
  }
}

/**
 * Set of button on the top right corner
 */
const TopRightLayout = () => {
  const { resign, gameMode, players } = useContext(GameContext)

  const resignMe = () => players && resign(players.enemy.id, players.me.id)

  return (
    <div className="absolute top-0 right-8 z-[17] flex items-center justify-center gap-x-1 p-1 lg:right-0 lg:gap-x-2 lg:p-2">
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

export default Layout
