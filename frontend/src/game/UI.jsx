import { Html } from "@react-three/drei"
import { useEffect, useState } from "react"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../components/ui/Button"
import notification from "../components/utils/Notification"
import toCapitalize from "../components/utils/ToCapitalize"
import { DEFAULT_CHECKER_POSITIONS } from "./data/Data"
import { GameState } from "./Game"
import userSwitch from "../assets/sounds/user-switch.mp3"
import { AuthContext } from "../context/AuthContext"

const UI = () => {
  const { setInGame } = useContext(AuthContext)
  const { userChecker, toggleControls, phase, setPhase, checkers } =
    useContext(GameState)

  const [playAudio] = useState(() => new Audio(userSwitch))

  const [winner, setWinner] = useState()
  const navigate = useNavigate()

  const playAgain = () => {
    setInGame(true)
    setPhase("initial")
    userChecker.current = "white"
    checkers.current = JSON.parse(JSON.stringify(DEFAULT_CHECKER_POSITIONS))
  }

  useEffect(() => {
    // Playing a sound effect when users change
    if (phase === "diceRoll" || phase === "diceRollAgain") {
      playAudio.play()
    }

    // Somebody's won
    if (phase === "ended") {
      setWinner(toCapitalize(userChecker.current))
      setInGame(false)
    } else {
      winner && setWinner()
    }
  }, [phase])

  return (
    phase && (
      <>
        <Html as="div" transform scale={0.2} position={[-1.75, 0.5, 0]} sprite>
          <div className="flex flex-col items-center gap-4 select-none">
            {/* Flipping the board */}
            {/* <Button
              className="text-white"
              onClick={() => {
                diceNums.current.dice1 = 5
                diceNums.current.dice2 = 2
                diceNums.current.moves = 2
              }}
            >
              Flip the board
            </Button> */}

            {/* Toggling orbit controls */}
            <Button
              className="text-white"
              onClick={() => {
                toggleControls(true)
                notification("hi", "error")
              }}
            >
              Toggle pan
            </Button>

            <div
              className={
                "p-2 rounded-lg " +
                (userChecker.current === "white"
                  ? "bg-slate-200 text-black"
                  : "bg-slate-600 text-white")
              }
            >
              <h1>{toCapitalize(userChecker.current)} to play!</h1>
            </div>
          </div>
        </Html>

        {/* Overlay when someone wins */}
        {winner && (
          <Html as="div" transform scale={0.2} position={[0, 0, 0]} sprite>
            <div className="p-6 flex flex-col gap-y-8 rounded-lg bg-[#cbd5e18f] select-none">
              <h1 className="text-4xl text-center">{winner} wins!</h1>
              <div className="w-full flex items-center gap-x-4">
                <Button onClick={playAgain}>Play again</Button>
                <Button
                  onClick={() => {
                    navigate("/")
                    setPhase()
                  }}
                >
                  Go back to menu
                </Button>
              </div>
            </div>
          </Html>
        )}
      </>
    )
  )
}

export default UI
