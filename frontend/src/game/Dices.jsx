import { Html } from "@react-three/drei"
import { useContext, useEffect, useRef, useState } from "react"
import Button from "../components/ui/Button"
import Dice from "./Dice"
import { GameState } from "./Game"
import resetDices from "./utils/ResetDices"
import throwDices from "./utils/ThrowDices"
import * as data from "./data/Data"

const Dices = () => {
  const { diceNums } = useContext(GameState)
  const dice1 = useRef()
  const dice2 = useRef()

  const [finishedThrow, setFinishedThrow] = useState(() => [false, false])

  useEffect(() => {
    console.log("dices: ", finishedThrow)
  }, [finishedThrow])

  return (
    <>
      <Html as="div" transform scale={0.2} position={[1.75, 0.5, 0]}>
        {/* Throwing the dice */}
        <Button
          className="text-white select-none"
          onClick={() => {
            resetDices([dice1.current, dice2.current])
            throwDices([dice1.current, dice2.current])
            // diceNums.current = getDiceMoves(diceNums)
            // setTimeout(() => console.log(diceNums.current), 3800)
          }}
        >
          Throw Dice
        </Button>
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
