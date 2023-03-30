import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../../components/ui/Button"
import Center from "../../components/ui/Center"
import Container from "../../components/ui/Container"
import toCapitalize from "../../components/utils/ToCapitalize"
import { GameContext } from "../context/GameContext"
import { DEFAULT_CHECKER_POSITIONS } from "../data/Data"

/**
 * An overlay when someone wins a live game.
 */
const WinnerOverlay = () => {
  const {
    winner,
    gameMode,
    setInGame,
    setPhase,
    userChecker,
    checkers,
    phase,
    players,
    dice,
    resetOrbit,
  } = useContext(GameContext)

  const navigate = useNavigate()

  // Function to request a rematch
  const playAgain = () => {
    if (gameMode.current === "pass-and-play") {
      setInGame(true)
      setPhase("initial")
      userChecker.current = "white"
      gameMode.current = "pass-and-play"
      dice.current = { dice1: 0, dice2: 0, moves: 0 }
      resetOrbit.current()
      checkers.current = JSON.parse(JSON.stringify(DEFAULT_CHECKER_POSITIONS))
    }
  }

  // Redirects the user back home
  const goHome = () => {
    navigate("/")
    setPhase(undefined)
  }

  if (phase !== "ended") return <></>

  let TopSection: JSX.Element
  if (gameMode.current === "pass-and-play") {
    const left = (
      <>
        <i className="fa-solid fa-user text-[30pt] text-black"></i>
        <h1>Black</h1>
      </>
    )

    const right = (
      <>
        <i className="fa-solid fa-user text-[30pt] text-white"></i>
        <h1>White</h1>
      </>
    )

    TopSection = (
      <Top
        score={userChecker.current === "black" ? "1 - 0" : "0 - 1"}
        left={left}
        right={right}
      />
    )
  } else {
    const getLeftRight = (el: "left" | "right") => {
      if (!players) return <></>

      return (
        <>
          <img
            src={el === "left" ? players.enemy.image : players.me.image}
            alt="Profile Pic"
            className="h-[50px] w-[50px] rounded-full object-cover object-center lg:h-[80px] lg:w-[80px] xl:h-[100px] xl:w-[100px]"
          />
          <h1>{el === "left" ? players.enemy.name : players.me.name}</h1>
        </>
      )
    }

    TopSection = (
      <Top
        score={winner.current?.id === players?.enemy.id ? "1 - 0" : "0 - 1"}
        left={getLeftRight("left")}
        right={getLeftRight("right")}
      />
    )
  }

  return (
    <Center className="z-[10]">
      <div className="h-full w-full rounded-lg bg-[#cbd5e18f] p-6">
        {TopSection}
        <div className="flex w-full flex-col gap-y-2 text-sm lg:text-base">
          <Button onClick={playAgain}>Rematch</Button>
          <Button onClick={goHome}>Main menu</Button>
        </div>
      </div>
    </Center>
  )
}

type TopProps = {
  score: string
  left: JSX.Element
  right: JSX.Element
}

const Top = ({ score, left, right }: TopProps) => {
  return (
    <div className="mb-4 flex items-center justify-between gap-x-4 p-4">
      {/* Black */}
      <div className="flex flex-col items-center gap-y-2">{left}</div>

      {/* Vs */}
      <div className="flex flex-col items-center text-xl">
        <h1>vs</h1>
        <h1>{score}</h1>
      </div>

      {/* White */}
      <div className="flex flex-col items-center gap-y-2">{right}</div>
    </div>
  )
}

export default WinnerOverlay
