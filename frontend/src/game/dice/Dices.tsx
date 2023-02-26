import { Html } from "@react-three/drei"
import { useContext, useEffect, useRef, useState } from "react"
import Button from "../../components/ui/Button"
import Dice from "./Dice"
import { GameState } from "../Game"
import resetDices from "../utils/ResetDices"
import throwDices from "../utils/ThrowDices"
import switchPlayers from "../utils/SwitchPlayers"
import hasMoves from "../utils/HasMoves"
import notification from "../../components/utils/Notification"
import InGameChat from "../ui/InGameChat"
import useFetch from "../../components/hooks/useFetch"
import { AuthContext } from "../../context/AuthContext"
import { RigidBodyApi } from "@react-three/rapier"
import { finishedThrowType } from "../types/Dice.type"
import { MessgaeType } from "../types/Message.type"
import { DICE_1_DEFAULT_POS, DICE_2_DEFAULT_POS } from "../data/Data"

/**
 * This is the container for the two dice.
 */
const Dices = () => {
  const {
    dice,
    phase,
    setPhase,
    checkers,
    userChecker,
    myTurn,
    ws,
    toggleZoom,
  } = useContext(GameState)
  const { user } = useContext(AuthContext)

  // Refs for the two dice
  const dice1 = useRef<RigidBodyApi>(null!)
  const dice2 = useRef<RigidBodyApi>(null!)

  // To keep track of the dices finished throwing state
  const [finishedThrow, setFinishedThrow] = useState<finishedThrowType>(null!)

  // State to show the "throw dice" button
  const [showThrowBtn, setShowThrowBtn] = useState(false)

  // In game messages
  const { data } = useFetch("/api/game/get-in-game-messages/")
  const messages: MessgaeType[] = data

  // Updating backend live game
  const updateLiveGame = (updateUsers: boolean) => {
    ws?.send(
      JSON.stringify({
        update: updateUsers,
        board: checkers.current,
        dice: dice.current,
        turn: userChecker.current,
      })
    )
  }

  // Throw the dice
  const throwDice = () => {
    toggleZoom.current(true)
    setShowThrowBtn(false)
    resetDices([dice1.current, dice2.current])
    throwDices([dice1.current, dice2.current])
  }

  // Handling the dice throws
  useEffect(() => {
    // Dices have finished throwing
    if (finishedThrow && finishedThrow[0] && finishedThrow[1]) {
      // Get and set the dice moves
      // If the dice numbers match, the user can move 4 times, otherwise 2

      // Check if user has any valid moves
      const moves = hasMoves(
        checkers.current,
        dice.current,
        userChecker.current!
      )

      // User has no moves
      if (!moves) {
        // Switch players
        userChecker.current = switchPlayers(userChecker.current!)

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
      if (dice.current.moves === 0) {
        if (dice.current.dice1 === dice.current.dice2) {
          dice.current.moves = 4
        } else {
          dice.current.moves = 2
        }
      }

      // Saving the dices in the DB, if user is playing a live game
      ws && updateLiveGame(true)

      // Setting the phase to checkerMove
      setPhase("checkerMove")
    }
  }, [finishedThrow])

  // Handling the phase changes
  useEffect(() => {
    // If it's not the user's turn or if the game has ended
    if (!myTurn || phase === "ended") {
      setShowThrowBtn(false)
      return
    }

    if (phase === "diceRoll" || phase === "diceRollAgain") {
      setShowThrowBtn(true)
    } else if (phase === "initial") {
      // User has initially connected to the game, with no
      // available/previous dice moves
      if (dice.current.moves === 0) {
        resetDices([dice1.current, dice2.current])
        setShowThrowBtn(true)
      }
      // User has leftover moves
      // (from a previous session that's saved on the DB)
      else {
        setFinishedThrow({ 0: true, 1: true })
      }
    }
  }, [phase])

  return (
    <>
      <Html
        as="div"
        transform
        scale={0.2}
        position={[1.75, 0.5, ws ? -0.25 : 0]}
        sprite
      >
        <div
          onPointerEnter={() => toggleZoom.current(false)}
          onPointerLeave={() => toggleZoom.current(true)}
          className="flex h-[125px] w-[150px] flex-col gap-y-4"
        >
          {/* Throwing the dice */}
          {showThrowBtn && (
            <Button className="w-full text-white" onClick={throwDice}>
              Throw Dice
            </Button>
          )}

          {/* In game chat */}
          {ws && (
            <InGameChat
              ws={ws}
              toggleZoom={toggleZoom.current}
              messages={messages}
              user={user?.username!}
            />
          )}
        </div>
      </Html>

      <Dice
        ref={dice1}
        index={0}
        position={DICE_1_DEFAULT_POS}
        setFinishedThrow={setFinishedThrow}
      />
      <Dice
        ref={dice2}
        index={1}
        position={DICE_2_DEFAULT_POS}
        setFinishedThrow={setFinishedThrow}
      />
    </>
  )
}

export default Dices
