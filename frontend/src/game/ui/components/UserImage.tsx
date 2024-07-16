import { useEffect, useState } from "react"
import { CountdownCircleTimer } from "react-countdown-circle-timer"
import Center from "../../../components/ui/Center"
import { USER_TURN_DURATION } from "../../data/Data"
import { PlayerType } from "../../types/Game.type"
import Messages from "./Messages"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useGameStore } from "@/game/store/useGameStore"
import Image from "next/image"

type UserImageType = {
  img: string | undefined
  player?: PlayerType
}

/**
 * This is the user's image on the side panels
 */
const UserImage = ({ img, player }: UserImageType) => {
  const phase = useGameStore(state => state.phase)
  const userChecker = useGameStore(state => state.userChecker)
  const gameMode = useGameStore.getState().gameMode

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
    const gameMode = useGameStore.getState().gameMode
    const players = useGameStore.getState().players

    if (!id || !players || gameMode !== "friend-game") return

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
    const timer = useGameStore.getState().timer

    if (!player || !timer || !["initial", "diceRoll", "diceRollAgain"].includes(phase!)) return

    // If user has been offline for too long then auto resign them
    if (Date.now() >= timer.time) {
      autoResign(timer.id)
    } else if (player.id === timer.id) {
      const timeLeft = (timer.time - Date.now()) / 1000
      setDuration(timeLeft)
      setIsPlaying(true)
      return
    } else {
      setKey(curr => curr + 1)
      setIsPlaying(false)
    }
  }, [phase])

  if (img === undefined || img === "") {
    return (
      <div className="m-4">
        <FontAwesomeIcon
          icon={faUser}
          className={`text-[40px] lg:text-[50px] ${player?.color === "white" ? "text-slate-200" : "text-slate-900"}`}
        />
      </div>
    )
  } else if (gameMode === "vs-computer") {
    return (
      <div className="relative">
        <div className="size-[60px] lg:size-[90px] xl:size-[110px]"></div>
        {/* Profile Pic */}
        <Center className="size-[50px] lg:size-[80px] xl:size-[100px]">
          <Image
            width={150}
            height={150}
            src={img}
            alt="img"
            className="size-full rounded-full object-cover object-center"
          />
        </Center>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* In game messages */}
      <Messages player={player} />

      {/* Timer */}
      {userChecker === player?.color ? (
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
              <div className="absolute z-10 size-[50px] lg:size-[80px] xl:size-[100px]">
                <div className="size-full rounded-full bg-[#6e6e6e99] text-red-500 lg:text-lg lg:font-bold">
                  <Center className="w-full text-center">{remainingTime} sec</Center>
                </div>
              </div>
            )
          }
        </CountdownCircleTimer>
      ) : (
        // Placeholder
        <div className="size-[60px] lg:size-[90px] xl:size-[110px]"></div>
      )}

      {/* Profile Pic */}
      <Center className="size-[50px] lg:size-[80px] xl:size-[100px]">
        <Image
          width={150}
          height={150}
          src={img}
          alt="img"
          className="size-full rounded-full object-cover object-center"
        />
      </Center>
    </div>
  )
}

export default UserImage
