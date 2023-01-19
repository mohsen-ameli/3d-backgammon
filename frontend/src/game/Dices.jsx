import { Html } from "@react-three/drei"
import { useContext, useEffect, useRef, useState } from "react"
import Button from "../components/ui/Button"
import Dice from "./Dice"
import { GameState } from "./Game"
import resetDices from "./utils/ResetDices"
import throwDices from "./utils/ThrowDices"
import * as data from "./data/Data"

const Dices = () => {
  const { diceNums, phase, setPhase } = useContext(GameState)
  const dice1 = useRef()
  const dice2 = useRef()

  const [finishedThrow, setFinishedThrow] = useState({
    0: false,
    1: false,
  })

  const [showThrowBtn, setShowThrowBtn] = useState(true)

  useEffect(() => {
    // Dices have finished throwing
    if (finishedThrow[0] && finishedThrow[1]) {
      // Get and set the dice moves
      if (diceNums.current[0] && diceNums.current[1]) {
        if (diceNums.current[0] === diceNums.current[1]) {
          diceNums.current[2] = 4
        } else {
          diceNums.current[2] = 2
        }
        // Set the phase to checkerMove
        setPhase("checkerMove")

        // Check if user has any valid moves
      }
    }
  }, [finishedThrow])

  useEffect(() => {
    if (phase === "diceRoll") {
      setShowThrowBtn(true)
    }
  }, [phase])

  return (
    <>
      <Html as="div" transform scale={0.2} position={[1.75, 0.5, 0]} sprite>
        {/* Throwing the dice */}
        {showThrowBtn && (
          <Button
            className="text-white select-none"
            onClick={() => {
              setShowThrowBtn(false)
              resetDices([dice1.current, dice2.current])
              throwDices([dice1.current, dice2.current])
              // diceNums.current = getDiceMoves(diceNums)
              // setTimeout(() => console.log(diceNums.current), 3800)
            }}
          >
            Throw Dice
          </Button>
        )}
      </Html>

      <Dice
        ref={dice1}
        index={0}
        position={data.DICE_1_DEFAULT_POS}
        setFinishedThrow={setFinishedThrow}
      />
      <Dice
        ref={dice2}
        index={1}
        position={data.DICE_2_DEFAULT_POS}
        setFinishedThrow={setFinishedThrow}
      />
    </>
  )
}

export default Dices
