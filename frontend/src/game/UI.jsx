import { Html } from "@react-three/drei"
import { useEffect, useState } from "react"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../components/ui/Button"
import toCapitalize from "../components/utils/ToCapitalize"
import { DEFAULT_CHECKER_POSITIONS } from "./data/Data"
import { GameState } from "./Game"
import { AuthContext } from "../context/AuthContext"

const UI = () => {
  const { inGame, setInGame, gameMode } = useContext(AuthContext)
  const { userChecker, toggleControls, phase, setPhase, checkers, resetOrbit, dice } = useContext(GameState) // prettier-ignore
  const navigate = useNavigate()

  const [winner, setWinner] = useState()

  const playAgain = () => {
    setInGame(true)
    setPhase("initial")
    userChecker.current = "white"
    checkers.current = JSON.parse(JSON.stringify(DEFAULT_CHECKER_POSITIONS))
  }

  useEffect(() => {
    // Somebody's won
    if (phase === "ended") {
      setWinner(toCapitalize(userChecker.current))
      setInGame(false)
    } else {
      winner && setWinner()
    }
  }, [phase])

  // User needs to have a game phase, as well as be in game
  // to see the button layout
  return (
    phase && (
      <>
        {inGame && (
          <Html
            as="div"
            transform
            scale={0.2}
            position={[-1.85, 0.5, 0]}
            sprite
          >
            <div className="relative flex flex-col items-center gap-y-4 w-[140px] h-[200px] select-none">
              {/* Flipping the board */}
              <Button className="text-white" onClick={resetOrbit.current}>
                Reset controls
              </Button>

              {/* Toggling orbit controls */}
              <Button
                className="text-white"
                onClick={() => toggleControls.current(true)}
              >
                Lock controls
              </Button>

              {/* Who's playing and with what dice nums */}
              <div
                className={
                  "absolute top-1/2 mt-2 p-2 rounded-sm text-center w-full " +
                  (userChecker.current === "white"
                    ? "bg-slate-200 text-black"
                    : "bg-slate-600 text-white")
                }
              >
                <h1>{toCapitalize(userChecker.current)} to play!</h1>
                {dice.current.moves > 0 && (
                  <div className="flex flex-col items-center mt-2">
                    <h1 className="mb-1">Dice moves</h1>
                    <DiceMoves dice={dice.current} />
                  </div>
                )}
              </div>
            </div>
          </Html>
        )}

        {/* Overlay when someone wins */}
        {winner && (
          <Html as="div" transform scale={0.2} position={[0, 0, 0]} sprite>
            <div className="p-6 flex flex-col gap-y-8 rounded-lg bg-[#cbd5e18f] select-none">
              <h1 className="text-4xl text-center">{winner} wins!</h1>
              <div className="w-full flex items-center justify-center gap-x-4">
                {gameMode.current === "pass-and-play" && (
                  <Button onClick={playAgain}>Play again</Button>
                )}
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

const getMoves = (num) => {
  if (num === 1) {
    return <i className="fa-solid fa-dice-one text-[18pt]"></i>
  } else if (num === 2) {
    return <i className="fa-solid fa-dice-two text-[18pt]"></i>
  } else if (num === 3) {
    return <i className="fa-solid fa-dice-three text-[18pt]"></i>
  } else if (num === 4) {
    return <i className="fa-solid fa-dice-four text-[18pt]"></i>
  } else if (num === 5) {
    return <i className="fa-solid fa-dice-five text-[18pt]"></i>
  } else if (num === 6) {
    return <i className="fa-solid fa-dice-six text-[18pt]"></i>
  }
}

const DiceMoves = ({ dice }) => {
  const jsx = []

  if (dice.moves > 2) {
    for (let i = 0; i < dice.moves; i++) {
      jsx.push(getMoves(dice.dice1))
    }
  } else if (dice.moves === 2) {
    jsx.push(getMoves(dice.dice1))
    jsx.push(getMoves(dice.dice2))
  } else if (dice.dice1 !== 0) {
    jsx.push(getMoves(dice.dice1))
  } else {
    jsx.push(getMoves(dice.dice2))
  }

  return (
    <div className="flex items-center gap-x-2">
      {jsx.map((number, index) => (
        <span key={index}>{number}</span>
      ))}
    </div>
  )
}

export default UI
