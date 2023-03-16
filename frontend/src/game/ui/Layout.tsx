import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { GameContext } from "../context/GameContext"
import ChatButton from "./ChatButton"
import LayoutBtn from "./LayoutBtn"
import WinnerOverlay from "./WinnerOverlay"
import SidePanel from "./SidePanel"
import Dialog from "./Dialog"
import useFetch from "../../components/hooks/useFetch"
import { PofileData } from "../../components/types/Profile.type"
import Settings from "./Settings"

/**
 * The main layout of the game. Includes buttons and side panels for each user.
 */
const Layout = () => {
  const { inGame } = useContext(GameContext)

  if (!inGame) return <WinnerOverlay />

  return (
    <>
      <LeftLayout />
      <RightLayout />
      <MainLayout />
    </>
  )
}

const MainLayout = () => {
  const { user } = useContext(AuthContext)
  const { gameMode, players } = useContext(GameContext)

  // Getting user image
  const { data }: PofileData = useFetch("/api/get-user-profile/")
  const [img, setImg] = useState("")
  useEffect(() => setImg(data?.image), [data])

  if (gameMode.current === "pass-and-play")
    return (
      <SidePanel
        img={img}
        player={players.current.me}
        sideType="me"
        user={user}
      />
    )

  return (
    <>
      <SidePanel img={img} player={players.current.me} sideType="me" />
      <SidePanel
        img={players.current.enemy.image}
        player={players.current.enemy}
        sideType="enemy"
      />
    </>
  )
}

const RightLayout = () => {
  const { resign, gameMode, players } = useContext(GameContext)

  const resignMe = () => resign(players.current.enemy.id, players.current.me.id)

  return (
    <div className="absolute top-0 right-0 flex items-center justify-center gap-x-1 p-1 lg:gap-x-2 lg:p-2">
      {gameMode.current !== "pass-and-play" && <ChatButton />}

      <div className="z-[10]">
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
    </div>
  )
}

const LeftLayout = () => {
  const { resetOrbit, toggleControls } = useContext(GameContext)

  const [controlsLock, setControlsLock] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)

  const switchControls = () => {
    toggleControls.current("layout")
    setControlsLock(curr => !curr)
  }

  const openSettings = () => setSettingsOpen(curr => !curr)
  const openInfo = () => setInfoOpen(curr => !curr)

  return (
    <>
      <div className="absolute top-0 left-0 z-[10] flex items-center justify-center gap-x-1 p-1 lg:gap-x-2 lg:p-2">
        <LayoutBtn title="Lock Controls" onClick={switchControls}>
          <i
            className={
              controlsLock ? "fa-solid fa-lock-open" : "fa-solid fa-lock"
            }
          />
        </LayoutBtn>

        <LayoutBtn title="Reset Controls" onClick={() => resetOrbit.current()}>
          <i className="fa-solid fa-rotate-left" />
        </LayoutBtn>

        <LayoutBtn title="Settings" onClick={openSettings}>
          <i className="fa-solid fa-gear" />
        </LayoutBtn>

        <LayoutBtn title="Info" onClick={openInfo}>
          <i className="fa-solid fa-info" />
        </LayoutBtn>
      </div>

      {settingsOpen && (
        <Dialog setOpen={setSettingsOpen}>
          <Settings setOpen={setSettingsOpen} />
        </Dialog>
      )}

      {infoOpen && (
        <Dialog setOpen={setInfoOpen}>
          <h1 className="mb-2 text-xl font-bold">How to play the game:</h1>
          <ul className="ml-8 list-disc leading-7">
            <li>
              Check to see what checker color you are playing as. You can see
              this on the top left corner of your profile picture.
            </li>
            <li>
              If it's your turn, throw the dice, and if not, wait your turn.
            </li>
            <li>
              You want to move all of your checkers to you home. If you are
              playing as white, you home will be the 6 bottom right columns, and
              if you're playing as black the top right 6, is your home.
            </li>
            <li>
              You want to move generally like a{" "}
              <i className="fa-solid fa-u rotate-90"></i> shape.
            </li>
            <li>
              The objective of the game is to move all of your checkers to your
              home, and then bear them off. The first player who bears all of
              their checkers off, will be the winner!
            </li>
          </ul>
        </Dialog>
      )}
    </>
  )
}

export default Layout
