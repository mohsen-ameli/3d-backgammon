import { PlayerType, TimerType, UserCheckerType } from "../types/Game.type"
import { UserType } from "../../context/User.type"
import ThrowButton from "./ThrowButton"
import DiceMoves from "./DiceMoves"
import { memo, useContext, useEffect, useMemo, useState } from "react"
import { GameContext } from "../context/GameContext"
import PipScore from "../utils/PipScore"
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

  const { gameMode, dice, userChecker, showThrow } = useContext(GameContext)

  // const [color] = useState<UserCheckerType>()

  // The counter component. If the gameMode is pass and play, then just show the image
  if (!player) return <></>

  return (
    <div
      className={
        "absolute top-1/2 z-[10] m-2 h-fit w-[90px] -translate-y-1/2 rounded-md bg-orange-900 px-2 py-4 md:w-[108px] lg:w-[180px] " +
        (sideType === "enemy" ? "left-0" : "right-0")
      }
    >
      <div className="flex flex-col items-center justify-center gap-y-4 text-white lg:gap-y-12">
        <div className="flex flex-col items-center">
          <UserImage img={img} player={player} />

          <div className="mt-2 flex flex-col items-center justify-center pb-10 text-xs lg:text-lg">
            {/* Username */}
            {img !== undefined && (
              <h1 className="mb-3">
                {player.name !== "" ? player.name : user?.username}
              </h1>
            )}

            {/* Score */}
            {/* <Score color={color} /> */}

            {/* User checker */}
            <div
              className={
                "absolute inset-2 h-[15px] w-[15px] rounded-full lg:h-[20px] lg:w-[20px] " +
                ((gameMode.current === "pass-and-play" &&
                  userChecker.current === "white") ||
                (gameMode.current !== "pass-and-play" &&
                  player?.color! === "white")
                  ? "bg-slate-200"
                  : "bg-slate-900")
              }
            />

            {/* Showing the throw dice, and dice moves dynamically based on gameMode */}
            {gameMode.current === "pass-and-play" ? (
              <>
                <ThrowButton className="absolute bottom-0 my-3 px-2" />
                {!showThrow && <DiceMoves dice={dice.current} />}
              </>
            ) : (
              userChecker.current === player.color && (
                <>
                  {sideType === "me" && (
                    <ThrowButton className="absolute bottom-0 my-3 px-2" />
                  )}
                  <DiceMoves dice={dice.current} />
                </>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

type ScoreProps = { color: UserCheckerType | undefined }

const Score = ({ color }: ScoreProps) => {
  const { phase, checkers } = useContext(GameContext)
  const [score, setScore] = useState(0)

  useMemo(() => {
    if (!color) return

    // phase === "checkerMoveAgain"
    // phase === "diceRoll" ||
    // phase === "diceRollAgain" ||
    // phase === "spectate" ||
    // phase === "spectating"

    console.log(phase)

    if (
      phase === "initial" ||
      phase === "checkerMove" ||
      phase === "checkerMoveAgain" ||
      phase === "spectate" ||
      phase === "spectating"
    ) {
      console.log("calculating score")
      setScore(PipScore(checkers.current, color))
      return
    }
  }, [phase, color])

  return <h1 className="mb-3">Score: {score}</h1>
}

export default memo(SidePanel)
