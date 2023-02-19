import { Html } from "@react-three/drei"
import { useContext, useEffect, useRef, useState } from "react"
import Button from "../components/ui/Button"
import Dice from "./Dice"
import { GameState } from "./Game"
import resetDices from "./utils/ResetDices"
import throwDices from "./utils/ThrowDices"
import * as data from "./data/Data"
import switchPlayers from "./utils/SwitchPlayers"
import resetDiceRotation from "./utils/ResetDiceRotation"
import hasMoves from "./utils/HasMoves"
import notification from "../components/utils/Notification"

const Dices = () => {
  const { dice, phase, setPhase, checkers, userChecker, myTurn, ws } =
    useContext(GameState)
  const dice1 = useRef()
  const dice2 = useRef()

  const [finishedThrow, setFinishedThrow] = useState({
    0: false,
    1: false,
  })

  const [showThrowBtn, setShowThrowBtn] = useState(false)

  const updateLiveGame = (updateUsers) => {
    ws.send(
      JSON.stringify({
        update: updateUsers,
        board: checkers.current,
        dice: dice.current,
        turn: userChecker.current,
      })
    )
  }

  useEffect(() => {
    // Dices have finished throwing
    if (finishedThrow[0] && finishedThrow[1]) {
      // Get and set the dice moves
      // If the dice numbers match, the user can move 4 times, otherwise 2
      if (dice.current.dice1 && dice.current.dice2) {
        // Check if user has any valid moves
        const moves = hasMoves(
          checkers.current,
          dice.current,
          userChecker.current
        )

        if (!moves) {
          // Switch players
          userChecker.current = switchPlayers(userChecker.current)
          // Reset the dice moves
          dice.current.moves = 0
          dice.current.dice1 = 0
          dice.current.dice2 = 0
          // Set the phase to diceRoll
          if (!ws) {
            setPhase("diceRollAgain")
            // Show the throw button again
            setShowThrowBtn(true)
          } else {
            // Updating the backend, if user is playing a live game
            updateLiveGame(true)
          }
          // Show a message that the user has no valid moves
          notification("You don't have a move!", "error")
          return
        }

        // Set the dice moves
        if (dice.current.dice1 === dice.current.dice2) {
          dice.current.moves = 4
        } else {
          dice.current.moves = 2
        }

        // Saving the dices in the DB, if user is playing a live game
        ws && updateLiveGame(false)

        // Set the phase to checkerMove
        setPhase("checkerMove")
      }
    }
  }, [finishedThrow])

  useEffect(() => {
    if (!myTurn || phase === "ended") {
      setShowThrowBtn(false)
      return
    }
    if (phase === "diceRoll" || phase === "diceRollAgain") {
      setShowThrowBtn(true)
    } else if (phase === "initial") {
      resetDices([dice1.current, dice2.current])
      resetDiceRotation([dice1.current, dice2.current])
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
