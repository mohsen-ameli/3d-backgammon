import { Html } from "@react-three/drei"
import { useContext, useEffect, useRef, useState } from "react"
import Button, { ButtonLoading } from "../../components/ui/Button"
import Dice from "./Dice"
import { GameState } from "../Game"
import resetDices from "../utils/ResetDices"
import throwDices, { throwDicePhysics } from "../utils/ThrowDices"
import switchPlayers from "../utils/SwitchPlayers"
import hasMoves from "../utils/HasMoves"
import notification from "../../components/utils/Notification"
import InGameChat from "../ui/InGameChat"
import useFetch from "../../components/hooks/useFetch"
import { AuthContext } from "../../context/AuthContext"
import { CuboidCollider, RigidBodyApi } from "@react-three/rapier"
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
    dicePhysics,
  } = useContext(GameState)
  const { user } = useContext(AuthContext)

  // Refs for the two dice
  const dice1 = useRef<RigidBodyApi>(null!)
  const dice2 = useRef<RigidBodyApi>(null!)

  // To keep track of the dices finished throwing state
  const [finishedThrow, setFinishedThrow] = useState<finishedThrowType>(null!)

  // To keep track of the dice sleeping state
  const [sleeping, setSleeping] = useState<finishedThrowType>({
    0: false,
    1: false,
  })

  // State to show the "throw dice" button
  const [showThrowBtn, setShowThrowBtn] = useState(false)

  // In game messages
  const { data } = useFetch("/api/game/get-in-game-messages/")
  const messages: MessgaeType[] = data

  // Updating backend live game
  const updateLiveGame = () => {
    ws?.send(
      JSON.stringify({
        update: true,
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

    const physics = throwDices([dice1.current, dice2.current])

    if (ws && user && userChecker.current) {
      ws.send(
        JSON.stringify({
          physics: true,
          user: {
            id: user.user_id,
            physics,
          },
        })
      )
    }
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
          updateLiveGame()
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
      ws && updateLiveGame()

      // Setting the phase to checkerMove
      setPhase("checkerMove")
    }
  }, [finishedThrow])

  // Handling the phase changes
  useEffect(() => {
    // User already has dice physics, and it's their turn, and they don't have the numbers on the dice saved
    // if (phase === "diceRollPhysics") {
    //   setTimeout(() => {
    //     if (dicePhysics.current) {
    //       resetDices([dice1.current, dice2.current])
    //       throwDicePhysics(
    //         [dice1.current, dice2.current],
    //         dicePhysics.current.physics
    //       )
    //     }
    //   }, 1000)
    //   setShowThrowBtn(false)
    //   return
    // }

    if (phase === "diceSync") {
      resetDices([dice1.current, dice2.current])
      throwDicePhysics(
        [dice1.current, dice2.current],
        dicePhysics.current?.physics
      )
      return
    }

    // If it's not the user's turn or if the game has ended
    if (phase === "ended" || !myTurn) {
      setShowThrowBtn(false)
      return
    }

    if (phase === "diceRoll" || phase === "diceRollAgain") {
      setShowThrowBtn(true)
      return
    }

    if (phase === "initial") {
      // User has initially connected to the game, with no available/previous dice moves
      if (dice.current.moves === 0) setShowThrowBtn(true)
      // User has leftover moves (from a previous session that's saved on the DB)
      else setFinishedThrow({ 0: true, 1: true })
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
          {showThrowBtn && sleeping[0] && sleeping[1] ? (
            <Button className="w-full text-white" onClick={throwDice}>
              Throw Dice
            </Button>
          ) : (
            showThrowBtn && (
              <Button className="w-full cursor-default break-all text-white">
                Loading dice...
              </Button>
            )
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

      {/* Dice Holder */}
      <CuboidCollider args={[0.5, 0.1, 0.5]} position={[0, 0.6, 2]} />

      <Dice
        ref={dice1}
        index={0}
        position={DICE_1_DEFAULT_POS}
        setFinishedThrow={setFinishedThrow}
        setSleeping={setSleeping}
      />
      <Dice
        ref={dice2}
        index={1}
        position={DICE_2_DEFAULT_POS}
        setFinishedThrow={setFinishedThrow}
        setSleeping={setSleeping}
      />
    </>
  )
}

export default Dices
