"use client"

import { useEffect, useState } from "react"
import { UserCheckerType } from "../../types/Checker.type"
import { PlayerType, TimerType } from "../../types/Game.type"
import DiceMoves from "../utils/DiceMoves"
import PipScore from "../utils/PipScore"
import ThrowButton from "./ThrowButton"
import UserImage from "./UserImage"
import { useGameStore } from "@/game/store/useGameStore"
import { shallow } from "zustand/shallow"

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
export default function SidePanel({ img, player, sideType }: SideProps) {
  // The counter component. If the gameMode is pass and play, then just show the image
  return (
    <div
      className={
        "absolute top-1/2 z-[15] mx-4 h-fit -translate-y-1/2 lg:mx-0 " + (sideType === "enemy" ? "left-0" : "right-0")
      }
    >
      <div className="flex h-full flex-col justify-center">
        <div className="relative mx-4 max-h-[200px] w-[90px] rounded-lg bg-[#8e84bab3] p-1 text-black md:w-[108px] lg:max-h-[300px] lg:w-[180px] lg:p-3">
          <div className="flex flex-col items-center justify-center">
            {/* Image */}
            <UserImage img={img} player={player} />

            <div className="mt-2 flex flex-col items-center justify-center text-xs lg:text-lg">
              {/* Username */}
              <h1 className="w-full break-all text-center">{(player?.name || player?.name !== "") && player?.name}</h1>

              {/* User checker color */}
              <div
                className={
                  "mb-2 mt-2 h-[20px] w-[20px] rounded-full lg:h-[30px] lg:w-[30px] " +
                  (player?.color === "white" ? "bg-slate-200" : "bg-slate-900")
                }
              />

              {/* Score */}
              <Score color={player?.color} />
            </div>
          </div>

          {/* The throw dice and dice numbers section */}
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
function BottomSection({ sideType, player }: BottomSectionProps) {
  const userChecker = useGameStore(state => state.userChecker)
  const gameMode = useGameStore(state => state.gameMode)
  const dice = useGameStore(state => state.dice, shallow)
  const [showButtons, setShowButtons] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setShowButtons(true)
    }, 10000)
  }, [])

  const show = showButtons && userChecker === player?.color && (dice.moves !== 0 || sideType === "me" || gameMode !== "friend-game")

  if (!show) return <></>

  return (
    <div className="z-15 absolute bottom-auto left-0 mt-4 w-full rounded-lg bg-[#8e84bab3] p-2 text-white">
      {/* Showing the throw button if it's my turn */}
      {(sideType === "me" || gameMode !== "friend-game") && <ThrowButton />}

      {/* Showing the dice moves if I've already thrown the dice */}
      {dice.moves > 0 && <DiceMoves />}
    </div>
  )
}

/**
 * The pip score
 */
function Score({ color }: { color: UserCheckerType | undefined }) {
  const phase = useGameStore(state => state.phase)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (!color) return

    const score_ = PipScore(color)
    setScore(score_)
  }, [phase, color])

  return <h1>Score: {score}</h1>
}
