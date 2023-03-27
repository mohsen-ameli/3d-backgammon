import { useContext, useEffect, useState } from "react"
import { CountdownCircleTimer } from "react-countdown-circle-timer"
import Center from "../../components/ui/Center"
import { GameContext } from "../context/GameContext"
import { USER_TURN_DURATION } from "../data/Data"
import { PlayerType } from "../types/Game.type"

type UserImageType = {
  img: string | undefined
  player?: PlayerType
}

/**
 * This is the user's image on the side panels
 */
const UserImage = ({ img, player }: UserImageType) => {
  const { gameMode, phase, players, resign, timer } = useContext(GameContext)

  const [size, setSize] = useState(() => resize())
  const [duration, setDuration] = useState(USER_TURN_DURATION)
  const [isPlaying, setIsPlaying] = useState(false)
  const [key, setKey] = useState(0)

  // Handling page resize, for the width of the timer ring
  function resize() {
    const width = window.innerWidth
    if (width <= 1024) return 62
    else if (width <= 1280) return 90
    else return 115
  }

  // Auto resign function
  function autoResign(id?: number) {
    if (!id || !players || gameMode.current === "pass-and-play") return

    // If I'm losing
    // if (id === players.me.id) {
    //   resign(players.enemy.id, id, true)
    //   notification(`${players.me.name} has timed out.`, "info")
    // } else {
    //   resign(players.me.id, players.enemy.id, true)
    //   notification(`${players.enemy.name} has timed out.`, "info")
    // }
  }

  // Handling resize
  useEffect(() => {
    const handleResize = () => setSize(resize())

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Handling the timer
  useEffect(() => {
    if (
      !player ||
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

  if (img === undefined || img === "")
    return (
      <div className="m-4">
        <i className="fa-solid fa-user text-[40px] lg:text-[50px]"></i>
      </div>
      // h-[50px] w-[50px] rounded-full object-cover object-center lg:h-[80px] lg:w-[80px] xl:h-[100px] xl:w-[100px]
    )

  if (gameMode.current === "pass-and-play")
    return (
      <img
        src={img}
        alt="img"
        className="h-[50px] w-[50px] rounded-full object-cover object-center lg:h-[80px] lg:w-[80px] xl:h-[100px] xl:w-[100px]"
      />
    )

  return (
    <div className="relative">
      <CountdownCircleTimer
        key={key}
        size={size}
        strokeWidth={4}
        isPlaying={isPlaying}
        duration={duration}
        colors={["#609633", "#f79501", "#A30000", "#681919"]}
        colorsTime={[duration, duration / 4, duration / 10, 0]}
        onComplete={() => autoResign(player?.id)}
      >
        {({ remainingTime }) =>
          (remainingTime / duration) * 100 <= 25 && (
            <div className="absolute z-10 h-[50px] w-[50px] lg:h-[80px] lg:w-[80px] xl:h-[100px] xl:w-[100px]">
              <div className="h-full w-full rounded-full bg-[#6e6e6e99] text-red-500 lg:text-lg lg:font-bold">
                <Center className="w-full text-center">
                  {remainingTime} sec
                </Center>
              </div>
            </div>
          )
        }
      </CountdownCircleTimer>
      <Center className="h-[50px] w-[50px] lg:h-[80px] lg:w-[80px] xl:h-[100px] xl:w-[100px]">
        <img
          src={img}
          alt="img"
          className="h-[50px] w-[50px] rounded-full object-cover object-center lg:h-[80px] lg:w-[80px] xl:h-[100px] xl:w-[100px]"
        />
      </Center>
    </div>
  )
}

export default UserImage
