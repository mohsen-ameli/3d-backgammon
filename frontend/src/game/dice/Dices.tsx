import { useCallback, useContext, useEffect, useRef, useState } from "react"
import Dice from "./Dice"
import { GameContext } from "../context/GameContext"
import { throwDice, throwDicePhysics } from "../utils/ThrowDice"
import switchPlayers from "../utils/SwitchPlayers"
import hasMoves from "../utils/HasMoves"
import notification from "../../components/utils/Notification"
import { CuboidCollider, RigidBodyApi } from "@react-three/rapier"
import { DiceReadyType } from "../types/Dice.type"
import { DICE_1_DEFAULT_POS, DICE_2_DEFAULT_POS } from "../data/Data"
import wsGood from "../../components/utils/wsGood"
import useUpdateLiveGame from "../utils/useUpdateLiveGame"

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
    dicePhysics,
    gameMode,
    throwDice: throwDiceContext,
    setShowThrow,
    players,
  } = useContext(GameContext)

  // Update live game hook
  const { updateLiveGame } = useUpdateLiveGame()

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

  // Function to throw the dice
  throwDiceContext.current = useCallback(() => {
    setShowThrowBtn(false)

    const physics = throwDice([dice1.current, dice2.current])

    const context = {
      physics: true,
      user: {
        user: {
          id: players.current.me.id,
          name: players.current.me.name,
          color: userChecker.current,
        },
        physics,
      },
    }

    if (ws && wsGood(ws)) ws.send(JSON.stringify(context))
  }, [ws])

  // Saving the show throw button in game context
  useEffect(() => {
    if (showThrowBtn && sleeping.dice1 && sleeping.dice2) setShowThrow(true)
    else if (showThrowBtn) setShowThrow(false)
    else setShowThrow(null)
  }, [showThrowBtn, sleeping])

  // Game logic: Handling the dice throws
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
    if (
      dice.current.moves === 0 &&
      dice.current.dice1 !== 0 &&
      dice.current.dice2 !== 0
    )
      dice.current.moves = dice.current.dice1 === dice.current.dice2 ? 4 : 2

    // Updating the backend
    ws && updateLiveGame()

    setPhase("checkerMove")
  }, [finishedThrow])

  // Game logic: Handling the phase changes
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
