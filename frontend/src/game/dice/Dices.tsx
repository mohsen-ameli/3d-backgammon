import { Html } from "@react-three/drei"
import { useContext, useEffect, useRef, useState } from "react"
import Button from "../../components/ui/Button"
import Dice from "./Dice"
import { GameContext } from "../context/GameContext"
import { throwDice, throwDicePhysics } from "../utils/ThrowDice"
import switchPlayers from "../utils/SwitchPlayers"
import hasMoves from "../utils/HasMoves"
import notification from "../../components/utils/Notification"
import InGameChat from "../ui/InGameChat"
import useFetch from "../../components/hooks/useFetch"
import { AuthContext } from "../../context/AuthContext"
import { CuboidCollider, RigidBodyApi } from "@react-three/rapier"
import { DiceReadyType } from "../types/Dice.type"
import { MessgaeType } from "../types/Message.type"
import { DICE_1_DEFAULT_POS, DICE_2_DEFAULT_POS } from "../data/Data"
import { GameWrapperContext } from "../context/GameWrapperContext"

/**
 * This is the container for the two dice.
 */
const Dices = () => {
  // Game context
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
  } = useContext(GameContext)

  // Auth context
  const { user } = useContext(AuthContext)

  // GameWrapper
  const { gameMode } = useContext(GameWrapperContext)

  // Refs for the two dice
  const dice1 = useRef<RigidBodyApi>(null!)
  const dice2 = useRef<RigidBodyApi>(null!)

  // To keep track of the dices finished throwing state
  const [finishedThrow, setFinishedThrow] = useState<DiceReadyType>({
    dice1: false,
    dice2: false,
  })

  // To keep track of the dice sleeping state
  const [sleeping, setSleeping] = useState<DiceReadyType>({
    dice1: false,
    dice2: false,
  })

  // State to show the "throw dice" button
  const [showThrowBtn, setShowThrowBtn] = useState(false)

  // In game messages
  const { data } = useFetch("/api/game/get-in-game-messages/")
  const messages: MessgaeType[] = data

  // Updating backend live game
  const updateLiveGame = () => {
    const context = {
      update: true,
      board: checkers.current,
      dice: dice.current,
      turn: userChecker.current,
    }
    ws?.send(JSON.stringify(context))
  }

  // Function to throw the dice
  const throwDice_ = () => {
    toggleZoom.current(true)
    setShowThrowBtn(false)

    const physics = throwDice([dice1.current, dice2.current])
    const context = {
      physics: true,
      user: {
        user: {
          id: user?.user_id,
          name: user?.username,
          color: userChecker.current,
        },
        physics,
      },
    }
    ws?.send(JSON.stringify(context))
  }

  // Handling the dice throws
  useEffect(() => {
    // Dices have not finished throwing
    if (!finishedThrow || !finishedThrow.dice1 || !finishedThrow.dice2) return

    // Check if user has any valid moves
    const moves = hasMoves(checkers.current, dice.current, userChecker.current!)

    // User has no moves
    if (!moves) {
      // Switch players
      userChecker.current = switchPlayers(userChecker.current!)
      // Reset the dice
      dice.current = { dice1: 0, dice2: 0, moves: 0 }

      // Set the phase to diceRoll
      if (!ws) {
        setPhase("diceRollAgain")
        setShowThrowBtn(true)
      } else {
        updateLiveGame()
      }

      // Show a message that the user has no valid moves
      notification("You don't have a move!", "error")
      return
    }

    // If the dice numbers match, user can move 4 times, otherwise 2
    if (dice.current.moves === 0)
      dice.current.moves = dice.current.dice1 === dice.current.dice2 ? 4 : 2

    // Updating the backend
    ws && updateLiveGame()

    setPhase("checkerMove")
  }, [finishedThrow])

  // Handling the phase changes
  useEffect(() => {
    // User already has dice physics, and it's their turn, and they don't have the numbers on the dice saved
    if (phase === "diceRollPhysics") {
      setTimeout(() => {
        throwDicePhysics(
          [dice1.current, dice2.current],
          dicePhysics.current?.physics!
        )
      }, 1000)
      setShowThrowBtn(false)
      return
    }

    // If our dice are being synced with the other user
    if (phase === "diceSync" && dicePhysics.current) {
      throwDicePhysics(
        [dice1.current, dice2.current],
        dicePhysics.current.physics
      )
      return
    }

    /**
     * ORDER IMPORTANT: (1) initial (2) ended (3) diceRoll or diceRollAgain
     */
    if (phase === "initial") {
      if (!myTurn && gameMode.current !== "pass-and-play") return

      // User has initially connected to the game, with no available/previous dice moves
      if (dice.current.moves === 0) setShowThrowBtn(true)
      // User has leftover moves (from a previous session that's saved on the DB)
      else setFinishedThrow({ dice1: true, dice2: true })
      return
    }

    // If it's not the user's turn or if the game has ended
    if (phase === "ended" || !myTurn) {
      setShowThrowBtn(false)
      return
    }

    // If user has thrown the dice
    if (phase === "diceRoll" || phase === "diceRollAgain") {
      setShowThrowBtn(true)
      return
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
          {showThrowBtn && sleeping && sleeping.dice1 && sleeping.dice2 ? (
            <Button className="w-full text-white" onClick={throwDice_}>
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
        showThrowBtn={showThrowBtn}
      />
      <Dice
        ref={dice2}
        index={1}
        position={DICE_2_DEFAULT_POS}
        setFinishedThrow={setFinishedThrow}
        setSleeping={setSleeping}
        showThrowBtn={showThrowBtn}
      />
    </>
  )
}

export default Dices
