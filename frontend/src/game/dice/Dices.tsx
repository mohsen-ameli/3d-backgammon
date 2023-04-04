import { Html } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { CuboidCollider, RigidBodyApi } from "@react-three/rapier"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { AudioListener, AudioLoader, PositionalAudio } from "three"
import wsGood from "../../components/utils/wsGood"
import { GameContext } from "../context/GameContext"
import {
  DICE_1_DEFAULT_POS,
  DICE_2_DEFAULT_POS,
  TRAINING_DICE_MODE,
} from "../data/Data"
import { DiceReadyType } from "../types/Dice.type"
import Modal from "../ui/Modal"
import hasMoves from "../utils/HasMoves"
import switchPlayers from "../utils/SwitchPlayers"
import { throwDice, throwDicePhysics } from "../utils/ThrowDice"
import useUpdateLiveGame from "../utils/useUpdateLiveGame"
import Dice from "./Dice"
import DiceCollisionAudio from "/sounds/NewDice.wav"

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

  const { camera } = useThree()

  // Refs for the two dice
  const dice1 = useRef<RigidBodyApi>(null!)
  const dice2 = useRef<RigidBodyApi>(null!)

  // Showing the invalid move panel
  const [show, setShow] = useState(false)

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

  // Collision audio
  const [audio, setAudio] = useState<PositionalAudio>()

  // Function to throw the dice
  throwDiceContext.current = useCallback(() => {
    if (!players) return

    setShowThrowBtn(false)

    const dice = TRAINING_DICE_MODE
      ? [dice1.current]
      : [dice1.current, dice2.current]
    const physics = throwDice(dice)

    const context = {
      physics: true,
      user: {
        user: {
          id: players.me.id,
          name: players.me.name,
          color: userChecker.current,
        },
        physics,
      },
    }

    if (ws && wsGood(ws)) ws.send(JSON.stringify(context))
  }, [ws, players])

  // Loading the collision audio for the dice
  useEffect(() => {
    const audioLoader = new AudioLoader()
    const listener = new AudioListener()
    camera.add(listener)

    audioLoader.load(DiceCollisionAudio, buffer => {
      const audio = new PositionalAudio(listener)
      audio.setBuffer(buffer)
      audio.setRefDistance(30)
      setAudio(audio)
    })

    return () => {
      camera.remove(listener)
    }
  }, [])

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
      setShow(true)
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
        if (!dicePhysics.current) return

        throwDicePhysics(
          [dice1.current, dice2.current],
          dicePhysics.current.physics
        )
      }, 2000)
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
      <Html>
        <Modal setOpen={setShow} open={show}>
          You don't have a move!
        </Modal>
      </Html>

      {/* Dice Holder */}
      <CuboidCollider args={[0.5, 0.1, 0.5]} position={[0, 0.4, 2]} />

      <Dice
        ref={dice1}
        index={0}
        position={DICE_1_DEFAULT_POS}
        setFinishedThrow={setFinishedThrow}
        setSleeping={setSleeping}
        showThrowBtn={showThrowBtn}
        audio={audio}
      />
      <Dice
        ref={dice2}
        index={1}
        position={DICE_2_DEFAULT_POS}
        setFinishedThrow={setFinishedThrow}
        setSleeping={setSleeping}
        showThrowBtn={showThrowBtn}
        audio={audio}
      />
    </>
  )
}

export default Dices
