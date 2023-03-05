import { Html } from "@react-three/drei"
import { useEffect, useState } from "react"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../../components/ui/Button"
import toCapitalize from "../../components/utils/ToCapitalize"
import { DEFAULT_CHECKER_POSITIONS } from "../data/Data"
import { GameContext } from "../context/GameContext"
import WinnerOverlay from "./WinnerOverlay"
import Side from "./Side"
import UserTurn from "./UserTurn"
import notification from "../../components/utils/Notification"
import { GameWrapperContext } from "../context/GameWrapperContext"

/**
 * UI elements to control the game flow. Mostly consists of normal HTML.
 */
const UI = () => {
  const {
    players,
    winner,
    userChecker,
    toggleControls,
    phase,
    setPhase,
    checkers,
    resetOrbit,
    dice,
    ws,
  } = useContext(GameContext)

  const { inGame, setInGame, gameMode } = useContext(GameWrapperContext)

  const navigate = useNavigate()

  const [winner_, setWinner] = useState<string | undefined>()

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

  // User is resigning.. what a loser
  const resign = () => {
    const msg = "Confirm resignation?"
    const context = JSON.stringify({
      resign: true,
      winner: players.current.enemy.id,
      resigner: players.current.me.id,
    })
    notification(msg, "resign", undefined, undefined, () => ws?.send(context))
  }

  // Checking for winners
  useEffect(() => {
    if (phase === "ended") {
      const winnerr =
        winner.current?.id === players.current.me.id
          ? "You are the winner!"
          : `${winner.current?.name} is the winner!`
      setWinner(toCapitalize(winnerr!))
      setInGame(false)
      dice.current.dice1 = 0
      dice.current.dice2 = 0
      dice.current.moves = 0
    } else {
      winner && setWinner(undefined)
    }
  }, [phase])

  // Show an overlay when someone wins
  if (phase && winner_)
    return (
      <WinnerOverlay
        winner={winner_}
        gameMode={gameMode.current!}
        playAgain={playAgain}
        goHome={goHome}
      />
    )

  // User needs to have a game phase, as well as be in game to see the button layout
  if (phase && inGame) {
    return (
      <>
        <Html transform scale={0.2} position={[-1.85, 0.5, 0]} sprite>
          <div className="relative flex h-[200px] w-[140px] select-none flex-col items-center gap-y-4">
            {/* Go back to home page */}
            {ws ? (
              <Button className="w-full text-white" onClick={resign}>
                Resign
              </Button>
            ) : (
              <Button
                className="w-full text-white"
                onClick={() => navigate("/")}
              >
                Go back home
              </Button>
            )}

            {/* Resetting the controls */}
            <Button className="w-full text-white" onClick={resetOrbit.current}>
              Reset controls
            </Button>

            {/* Toggling orbit controls */}
            <Button
              className="w-full text-white"
              onClick={() => toggleControls.current(true)}
            >
              Lock controls
            </Button>

            {/* Who's playing and with what dice nums */}
            <UserTurn userChecker={userChecker.current!} dice={dice.current!} />
          </div>
        </Html>

        {ws && (
          <>
            {/* My side */}
            <Side
              ws={ws}
              player="You are"
              color={players.current.me.color}
              userChecker={userChecker.current}
              players={players.current}
            />

            {/* Enemy side */}
            <Side
              ws={ws}
              player={`${players.current.enemy.name} is`}
              color={players.current.enemy.color}
              userChecker={userChecker.current}
              players={players.current}
            />
          </>
        )}
      </>
    )
  }

  return <></>
}

export default UI
