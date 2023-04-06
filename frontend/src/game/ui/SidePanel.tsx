import { memo, useContext, useEffect, useState } from "react"
import { GameContext } from "../context/GameContext"
import { UserCheckerType } from "../types/Checker.type"
import { PlayerType, TimerType } from "../types/Game.type"
import DiceMoves from "./DiceMoves"
import PipScore from "./PipScore"
import ThrowButton from "./ThrowButton"
import UserImage from "./UserImage"

type SideProps = {
  img: string | undefined
  player: PlayerType | undefined
  sideType: "enemy" | "me"
  timer?: TimerType
}

/**
 * Each player has a side, with their profile picture, name, their checker color,
 * and a timer for them to see how much time they have left to make a move.
 */
const SidePanel = (props: SideProps) => {
  const { img, player, sideType } = props

  // The counter component. If the gameMode is pass and play, then just show the image
  return (
    <div
      className={
        "absolute top-1/2 z-[15] mx-4 h-full -translate-y-1/2 lg:mx-0 " +
        (sideType === "enemy" ? "left-0" : "right-0")
      }
    >
      <div className="flex h-full flex-col justify-center">
        <div className="relative m-2 max-h-[200px] w-[90px] rounded-lg bg-[#8e84bab3] p-3 text-black md:w-[108px] lg:max-h-[300px] lg:w-[180px] ">
          <div className="flex flex-col items-center justify-center">
            {/* Image */}
            <UserImage img={img} player={player} />

            <div className="mt-2 flex flex-col items-center justify-center text-xs lg:text-lg">
              {/* Username */}
              <h1>{(player?.name || player?.name !== "") && player?.name}</h1>

              {/* User checker color */}
              <div
                className={
                  "mt-2 mb-2 h-[20px] w-[20px] rounded-full lg:h-[30px] lg:w-[30px] " +
                  (player?.color === "white" ? "bg-slate-200" : "bg-slate-900")
                }
              />

              {/* Score */}
              <Score color={player?.color} />
            </div>
          </div>

          {/* The throw dice, and dice numbers section */}
          <BottomSection sideType={sideType} player={player} />
        </div>
      </div>
    </div>
  )
}

type BottomSectionProps = {
  sideType: "me" | "enemy"
  player: PlayerType | undefined
}

/**
 * The part that includes the throw dice and dice numbers.
 */
const BottomSection = ({ sideType, player }: BottomSectionProps) => {
  const { dice, userChecker, gameMode } = useContext(GameContext)

  if (
    userChecker.current === player?.color &&
    (dice.current.moves !== 0 ||
      sideType === "me" ||
      gameMode.current === "pass-and-play")
  ) {
    return (
      <div className="absolute bottom-auto left-0 mt-4 w-full rounded-lg bg-[#8e84bab3] p-2 text-white">
        {(sideType === "me" || gameMode.current === "pass-and-play") && (
          <ThrowButton />
        )}
        <DiceMoves dice={dice.current} />
      </div>
    )
  } else return <></>
}

type ScoreProps = { color: UserCheckerType | undefined }

/**
 * The pip score
 */
const Score = ({ color }: ScoreProps) => {
  const { phase, checkers } = useContext(GameContext)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (!color) return

    const score_ = PipScore(checkers.current, color)
    setScore(score_)
  }, [phase, color])

  return <h1>Pip: {score}</h1>
}

export default memo(SidePanel)
