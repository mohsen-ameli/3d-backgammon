import { memo, useContext, useMemo, useState } from "react"
import { UserType } from "../../context/User.type"
import { GameContext } from "../context/GameContext"
import { PlayerType, TimerType, UserCheckerType } from "../types/Game.type"
import PipScore from "../utils/PipScore"
import DiceMoves from "./DiceMoves"
import ThrowButton from "./ThrowButton"
import UserImage from "./UserImage"

type SideProps = {
  img: string | undefined
  player: PlayerType | undefined
  sideType: "enemy" | "me"
  timer?: TimerType

  // For pass-and-play
  showThrow?: boolean | null
  user?: UserType
}

/**
 * Each player has a side, with their profile picture, name, their checker color,
 * and a timer for them to see how much time they have left to make a move.
 */
const SidePanel = (props: SideProps) => {
  const { img, player, sideType, user } = props

  const { gameMode, userChecker } = useContext(GameContext)

  const getName = () => {
    if (player?.name || player?.name !== "") return player?.name
    else if (user?.username) return user?.username
    else return "Guest"
  }

  // The counter component. If the gameMode is pass and play, then just show the image
  return (
    <div
      className={
        "absolute top-1/2 z-[15] h-full -translate-y-1/2 " +
        (sideType === "enemy" ? "left-0" : "right-0")
      }
    >
      <div className="flex h-full flex-col justify-center">
        <div className="relative m-2 max-h-[200px] w-[90px] rounded-lg bg-[rgba(142,132,186,0.43)] p-3 text-black md:w-[108px] lg:max-h-[300px] lg:w-[180px] ">
          <div className="flex flex-col items-center justify-center">
            {/* Image */}
            <UserImage img={img} player={player} />

            <div className="mt-2 flex flex-col items-center justify-center text-xs lg:text-lg">
              {/* Username */}
              <h1>{getName()}</h1>

              {/* Score */}
              {/* <Score color={color} /> */}

              {/* User checker color */}
              <div
                className={
                  "mt-2 mb-2 h-[20px] w-[20px] rounded-full lg:h-[30px] lg:w-[30px] " +
                  ((gameMode.current === "pass-and-play" &&
                    userChecker.current === "white") ||
                  (gameMode.current !== "pass-and-play" &&
                    player?.color! === "white")
                    ? "bg-slate-200"
                    : "bg-slate-900")
                }
              />
            </div>
          </div>
          <BottomPart sideType={sideType} player={player} />
        </div>
      </div>
    </div>
  )
}

type BottomPartProps = {
  sideType: "me" | "enemy"
  player: PlayerType | undefined
}

const BottomPart = ({ sideType, player }: BottomPartProps) => {
  const { gameMode, dice, userChecker, showThrow } = useContext(GameContext)

  // Showing the throw dice, and dice moves dynamically based on gameMode
  if (gameMode.current === "pass-and-play") {
    return (
      <div className="absolute bottom-auto left-0 mt-4 w-[90px] rounded-lg bg-[#e0d5d552] p-2 text-black md:w-[108px] lg:w-[180px]">
        <ThrowButton />
        {!showThrow && <DiceMoves dice={dice.current} />}
      </div>
    )
  } else if (
    userChecker.current === player?.color &&
    (dice.current.moves !== 0 || sideType === "me")
  ) {
    return (
      <div className="absolute bottom-auto left-0 mt-4 w-[90px] rounded-lg bg-[#e0d5d552] p-2 text-black md:w-[108px] lg:w-[180px] ">
        {sideType === "me" && <ThrowButton />}
        <DiceMoves dice={dice.current} />
      </div>
    )
  } else return <></>
}

type ScoreProps = { color: UserCheckerType | undefined }

const Score = ({ color }: ScoreProps) => {
  const { phase, checkers } = useContext(GameContext)
  const [score, setScore] = useState(0)

  useMemo(() => {
    if (!color) return

    if (
      phase === "initial" ||
      phase === "checkerMove" ||
      phase === "checkerMoveAgain" ||
      phase === "spectate" ||
      phase === "spectating"
    ) {
      setScore(PipScore(checkers.current, color))
      return
    }
  }, [phase, color])

  return <h1 className="mb-3">Score: {score}</h1>
}

export default memo(SidePanel)
