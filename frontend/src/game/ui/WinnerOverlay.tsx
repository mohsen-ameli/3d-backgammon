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
  } = useContext(GameContext)

  const navigate = useNavigate()

  const [winnerName, setWinnerName] = useState<string>()

  // Checking for winners
  useEffect(() => {
    if (phase !== "ended") return

    let winnerName: string

    if (winner.current?.id === players.current.me.id)
      winnerName = "You are the winner!"
    else winnerName = `${winner.current?.name} is the winner!`

    setWinnerName(winnerName)
  }, [phase])

  // Function to request a rematch
  const playAgain = () => {
    setInGame(true)
    setPhase("initial")
    userChecker.current = "white"
    checkers.current = JSON.parse(JSON.stringify(DEFAULT_CHECKER_POSITIONS))
  }

  // Redirects the user back home
  const goHome = () => {
    navigate("/")
    setPhase(undefined)
  }

  if (phase !== "ended") return <></>

  return (
    <Center className="z-[10]">
      <div className="h-full w-full rounded-lg bg-[#cbd5e18f] p-6">
        <h1 className="mb-4 text-center text-xl font-bold lg:text-4xl">
          {winnerName}
        </h1>
        <div className="flex w-full flex-col gap-y-2 text-sm lg:text-base">
          {gameMode.current === "pass-and-play" && (
            <Button onClick={playAgain}>Play again</Button>
          )}
          <Button onClick={goHome}>Main menu</Button>
        </div>
      </div>
    </Center>
  )
}

export default WinnerOverlay
