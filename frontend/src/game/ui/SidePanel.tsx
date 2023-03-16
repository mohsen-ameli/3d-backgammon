import { PlayerType, TimerType } from "../types/Game.type"
import { CountdownCircleTimer } from "react-countdown-circle-timer"
import { UserType } from "../../context/User.type"
import ThrowButton from "./ThrowButton"
import DiceMoves from "./DiceMoves"
import Center from "../../components/ui/Center"
import { memo, useContext, useEffect, useState } from "react"
import { GameContext } from "../context/GameContext"
import notification from "../../components/utils/Notification"
import { USER_TURN_DURATION } from "../data/Data"

type SideProps = {
  img: string
  // userChecker: UserCheckerType
  player: PlayerType
  // dice: DiceMoveType
  sideType: "enemy" | "me"
  // gameMode: GameModeType
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

  const {
    phase,
    resign,
    players,
    timer,
    gameMode,
    dice,
    userChecker,
    showThrow,
  } = useContext(GameContext)

  const [duration, setDuration] = useState(USER_TURN_DURATION)
  const [isPlaying, setIsPlaying] = useState(false)
  const [key, setKey] = useState(0)
  const [size, setSize] = useState(() => resize())

  // Handling page resize, for the width of the timer ring
  function resize() {
    const width = window.innerWidth
    if (width <= 1024) return 62
    else if (width <= 1280) return 90
    else return 115
  }

  // Auto resign function
  function autoResign(id: number) {
    if (gameMode.current === "pass-and-play") return

    // If I'm losing
    if (id === players.current.me.id) {
      resign(players.current.enemy.id, id, true)
      notification(`${players.current.me.name} has timed out.`, "info")
    } else {
      resign(players.current.me.id, players.current.enemy.id, true)
      notification(`${players.current.enemy.name} has timed out.`, "info")
    }
  }

  // Handling the timer
  useEffect(() => {
    if (
      !timer.current ||
      !["initial", "diceRoll", "diceRollAgain"].includes(phase!)
    )
      return

    // If user has been offline for too long then auto resign them
    if (Date.now() >= timer.current.time) {
      autoResign(timer.current.id)
    } else if (player.id === timer.current.id) {
      const timeLeft = (timer.current.time - Date.now()) / 1000
      setDuration(timeLeft)
      setIsPlaying(true)
      return
    } else {
      setKey(curr => curr + 1)
      setIsPlaying(false)
    }
  }, [phase])

  // Handling resize
  useEffect(() => {
    const handleResize = () => setSize(resize())

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  /**
   * TODO: Fix the overlay.
   */

  // The counter component. If the gameMode is pass and play, then just show the image
  const Counter =
    gameMode.current === "pass-and-play" ? (
      <img
        src={img}
        alt={sideType}
        className="h-[50px] w-[50px] rounded-full object-cover object-center lg:h-[80px] lg:w-[80px] xl:h-[100px] xl:w-[100px]"
      />
    ) : (
      <div className="relative">
        <CountdownCircleTimer
          key={key}
          size={size}
          strokeWidth={4}
          isPlaying={isPlaying}
          duration={duration}
          colors={["#609633", "#f79501", "#A30000", "#681919"]}
          colorsTime={[duration, duration / 4, duration / 10, 0]}
          onComplete={() => autoResign(player.id)}
        >
          {({ remainingTime }) =>
            (remainingTime / duration) * 100 <= 25 && (
              <div className="absolute h-full w-full rounded-full bg-[#6e6e6e99] text-red-500 lg:text-lg lg:font-bold">
                <Center className="w-full text-center">
                  {remainingTime} sec
                </Center>
              </div>
            )
          }
        </CountdownCircleTimer>
        <Center className="-z-[1] h-[50px] w-[50px] lg:h-[80px] lg:w-[80px] xl:h-[100px] xl:w-[100px]">
          <img
            src={img}
            alt={sideType}
            className="rounded-full object-cover object-center"
          />
        </Center>
      </div>
    )

  return (
    <div
      className={
        "absolute top-1/2 z-[10] m-2 h-fit w-[90px] -translate-y-1/2 rounded-md bg-orange-900 px-2 py-4 md:w-[108px] lg:w-[180px] " +
        (sideType === "enemy" ? "left-0" : "right-0")
      }
    >
      <div className="flex flex-col items-center justify-center gap-y-4 text-white lg:gap-y-12">
        <div className="flex flex-col items-center">
          {Counter}

          <div className="mt-2 flex flex-col items-center justify-center pb-10 text-xs lg:text-lg">
            <h1>{player.name !== "" ? player.name : user?.username}</h1>

            <div
              className={
                "absolute inset-2 h-[15px] w-[15px] rounded-full lg:h-[20px] lg:w-[20px] " +
                ((gameMode.current === "pass-and-play" &&
                  userChecker.current === "white") ||
                (gameMode.current !== "pass-and-play" &&
                  player.color === "white")
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

export default memo(SidePanel)
