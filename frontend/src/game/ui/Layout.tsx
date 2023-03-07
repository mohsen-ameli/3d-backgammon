import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { GameContext } from "../context/GameContext"
import ChatButton from "./ChatButton"
import DiceMoves from "./DiceMoves"
import LayoutBtn from "./LayoutBtn"
import ThrowButton from "./ThrowButton"
import { DiceMoveType } from "../types/Dice.type"
import { GameModeType, PlayerType, UserCheckerType } from "../types/Game.type"
import WinnerOverlay from "./WinnerOverlay"
import { UserType } from "../../context/User.type"
import Center from "../../components/ui/Center"
import { Children } from "../../components/children.type"

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

type SideProps = {
  img: string
  userChecker: UserCheckerType
  player: PlayerType
  dice: DiceMoveType
  sideType: "enemy" | "me"
  gameMode: GameModeType

  // For pass-and-play
  showThrow?: boolean | null
  user?: UserType
}

/**
 * Side cards that contain the user image, name, and dynamically switches between showing the
 * throw button, and the dice moves.
 */
const Side = ({
  img,
  dice,
  userChecker,
  player,
  sideType,
  gameMode,
  showThrow,
  user,
}: SideProps) => {
  return (
    <div
      className={
        "absolute top-1/2 z-[10] m-2 h-fit w-[130px] -translate-y-1/2 rounded-md bg-orange-900 px-2 py-4 lg:w-[180px] " +
        (sideType === "enemy" ? "left-0" : "right-0")
      }
    >
      <div className="flex flex-col items-center justify-center gap-y-4 text-white lg:gap-y-12">
        <div className="flex flex-col items-center">
          <img
            src={img}
            alt={sideType}
            className="h-[50px] w-[50px] rounded-full object-cover object-center lg:h-[80px] lg:w-[80px] xl:h-[100px] xl:w-[100px]"
          />
          <div className="mt-2 flex flex-col items-center justify-center pb-10 text-xs lg:text-lg">
            <h1>{player.name !== "" ? player.name : user?.username}</h1>

            <div
              className={
                "absolute inset-2 h-[20px] w-[20px] rounded-full " +
                ((gameMode === "pass-and-play" && userChecker === "white") ||
                player.color === "white"
                  ? "bg-slate-200"
                  : "bg-slate-900")
              }
            />

            {/* Showing the throw dice, and dice moves dynamically based on gameMode */}
            {gameMode === "pass-and-play" ? (
              <>
                <ThrowButton className="absolute bottom-0 my-3 px-2" />
                {!showThrow && <DiceMoves dice={dice} />}
              </>
            ) : (
              userChecker === player.color && (
                <>
                  {sideType === "me" && (
                    <ThrowButton className="absolute bottom-0 my-3 px-2" />
                  )}
                  <DiceMoves dice={dice} />
                </>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const MainLayout = () => {
  const { user } = useContext(AuthContext)
  const { dice, gameMode, userChecker, players, showThrow } =
    useContext(GameContext)

  if (gameMode.current === "pass-and-play")
    return (
      <Side
        img="/person2.jpg"
        dice={dice.current}
        userChecker={userChecker.current!}
        player={players.current.me}
        sideType="me"
        gameMode={gameMode.current}
        showThrow={showThrow}
        user={user}
      />
    )

  return (
    <>
      <Side
        img="/person1.jpg"
        dice={dice.current}
        userChecker={userChecker.current!}
        player={players.current.enemy}
        sideType="enemy"
        gameMode={gameMode.current}
      />
      <Side
        img="/person2.jpg"
        dice={dice.current}
        userChecker={userChecker.current!}
        player={players.current.me}
        sideType="me"
        gameMode={gameMode.current}
      />
    </>
  )
}

const RightLayout = () => {
  const { resign, gameMode } = useContext(GameContext)

  return (
    <div className="absolute top-0 right-0 flex items-center justify-center gap-x-1 p-1 md:gap-x-2 md:p-2">
      {gameMode.current !== "pass-and-play" && <ChatButton />}

      <div className="z-[10]">
        {gameMode.current === "pass-and-play" ? (
          <Link to="/">
            <LayoutBtn title="Exit">
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </LayoutBtn>
          </Link>
        ) : (
          <LayoutBtn title="Resign" onClick={resign}>
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
    toggleControls.current(true)
    setControlsLock(curr => !curr)
  }

  const openSettings = () => setSettingsOpen(curr => !curr)
  const openInfo = () => setInfoOpen(curr => !curr)

  return (
    <>
      <div className="absolute top-0 left-0 z-[10] flex items-center justify-center gap-x-1 p-1 md:gap-x-2 md:p-2">
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
        <Caruosel setOpen={setSettingsOpen}>
          <h1>Settings</h1>
        </Caruosel>
      )}

      {infoOpen && (
        <Caruosel setOpen={setInfoOpen}>
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
        </Caruosel>
      )}
    </>
  )
}

type CarouselProps = Children & {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Caruosel = ({ setOpen, children }: CarouselProps) => {
  return (
    <>
      <div
        className="absolute top-0 left-0 z-[20] h-screen w-screen bg-[#0000005a]"
        onClick={() => setOpen(false)}
      />
      <div className="fixed left-1/2 top-1/2 z-[20] -translate-x-1/2 -translate-y-1/2 text-white">
        <div className="custom-scroll-bar max-h-screen min-w-[300px] max-w-[600px] rounded-md border-2 border-orange-700 bg-orange-900 p-8">
          {children}
        </div>

        <button
          className="absolute top-2 right-5 text-2xl duration-100 hover:text-slate-400 hover:ease-in-out"
          onClick={() => setOpen(false)}
        >
          x
        </button>
      </div>
    </>
  )
}

export default Layout
