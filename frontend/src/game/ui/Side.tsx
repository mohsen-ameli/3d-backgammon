import { Html } from "@react-three/drei"
import gsap, { Power1 } from "gsap"
import { useContext, useEffect, useRef, useState } from "react"
import { GameContext } from "../context/GameContext"
import { PlayersType, UserCheckerType } from "../types/Game.type"

type SideProps = {
  ws?: WebSocket
  player: string
  color: UserCheckerType
  userChecker?: UserCheckerType
  players?: PlayersType
}

/**
 * Each player has a side, with their profile picture, name, their checker color,
 * and a timer for them to see how much time they have left to make a move.
 */

const BASE_TIME = 20
const GRACE_TIME = 5

const Side = ({ ws, player, color, userChecker, players }: SideProps) => {
  const { phase } = useContext(GameContext)

  const [timer, setTimer] = useState(BASE_TIME + 1)

  // If user has timed out, then we will resign them
  const resign = () => {
    if (userChecker === players?.me.color) {
      // console.log("resign: ", userChecker)
      // I've been offline for too long
      // ws?.send(JSON.stringify({ finished: true, winner: players?.enemy.id }))
    } else {
      // console.log("resign: ", userChecker)
      // Enemy has been offline for too long
      // ws?.send(JSON.stringify({ finished: true, winner: players?.me.id }))
    }
  }

  const breatheEl = useRef<HTMLDivElement>(null)

  const animation = useRef<gsap.core.Tween>()

  const pause = () => {
    animation.current?.restart()
    animation.current?.pause()
  }
  const play = () => animation.current?.play()

  // useEffect(() => {
  // const shadowColor =
  //   (timer / BASE_TIME) * 100 < 17
  //     ? "#EF4444"
  //     : (timer / BASE_TIME) * 100 < 34
  //     ? "#F97316"
  //     : "#71e90ea3"

  // animation.current = gsap.fromTo(
  //   breatheEl.current,
  //   { boxShadow: `0 0 0px 0px #71e90ea3`, paused: true },
  //   {
  //     duration: 1.75,
  //     boxShadow: `0 0 5px 5px #71e90ea3`,
  //     yoyo: true,
  //     repeat: -1,
  //     ease: Power1.easeInOut,
  //     paused: true,
  //   }
  // )

  // if (animation.current)
  //   animation.current.vars.boxShadow = `0 0 0px 0px ${shadowColor}`
  // }, [timer])

  useEffect(() => {
    // Breathing animation
    animation.current = gsap.fromTo(
      breatheEl.current,
      { boxShadow: `0 0 0px 0px #71e90ea3`, paused: true },
      {
        duration: 1.75,
        boxShadow: `0 0 5px 5px #71e90ea3`,
        yoyo: true,
        repeat: -1,
        ease: Power1.easeInOut,
        paused: true,
      }
    )

    // Timer
    let newTime = timer

    const timeout = () => {
      setTimer(t => {
        newTime = t - 1
        return newTime
      })

      if (newTime > -GRACE_TIME) {
        setTimeout(timeout, 1000)
      } else {
        // Auto resign
        resign()
      }
    }

    if (userChecker === color) timeout()
  }, [])

  // Playing and pausing the animation
  useEffect(() => {
    if (userChecker === color) play()
    else pause()
  }, [phase])

  return (
    <Html
      transform
      scale={0.2}
      position={[0, 0.25, player.includes("You") ? 1.2 : -1.2]}
      sprite
    >
      <div
        ref={breatheEl}
        className={
          "flex h-full w-full items-center gap-x-2 rounded-full px-4 py-2 " +
          (color === "white"
            ? "bg-slate-200 text-black"
            : "bg-slate-600 text-white")
        }
      >
        <i className="fa-solid fa-user"></i>
        <h1 className="text-lg">
          {player} playing as {color}.
        </h1>
        {/* <img src="" alt="pfp" /> */}

        {/* {userChecker === color &&
          timer > 0 &&
          (timer / BASE_TIME) * 100 < 34 && (
            <h1
              className={
                (timer / BASE_TIME) * 100 < 17
                  ? "text-red-500"
                  : (timer / BASE_TIME) * 100 < 34
                  ? "text-orange-500"
                  : ""
              }
            >
              {timer} {timer > 1 ? "seconds" : "second"} left !
            </h1>
          )} */}
      </div>
    </Html>
  )
}

export default Side
