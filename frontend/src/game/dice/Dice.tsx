import { Html } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { CuboidCollider, RigidBodyApi } from "@react-three/rapier"
import { useCallback, useEffect, useRef, useState } from "react"
import { AudioListener, AudioLoader, PositionalAudio } from "three"
import wsGood from "../../components/utils/wsGood"
import { DICE_1_DEFAULT_POS, DICE_2_DEFAULT_POS } from "../data/Data"
import { DiceReadyType } from "../types/Dice.type"
import hasMoves from "../utils/HasMoves"
import switchPlayers from "../utils/SwitchPlayers"
import Die from "./Die"
import { throwDice, throwDicePhysics } from "./utils/ThrowDice"
import Modal from "@/components/ui/Modal"
import { useGameStore } from "../store/useGameStore"
import updateLiveGame from "../utils/updateLiveGame"

/**
 * This is the container for the two dice.
 */
export default function Dice() {
  const phase = useGameStore(state => state.phase)

  const { camera } = useThree()

  // Refs for the two dice
  const dice1 = useRef<RigidBodyApi>(null!)
  const dice2 = useRef<RigidBodyApi>(null!)

  // Showing the invalid move panel
  const [show, setShow] = useState(false)

  // To keep track of the dice finished throwing state
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
  const throwDiceFunc = useCallback(async () => {
    const players = useGameStore.getState().players!
    const userChecker = useGameStore.getState().userChecker!
    const ws = useGameStore.getState().ws

    setShowThrowBtn(false)

    const dice = [dice1.current, dice2.current]
    const physics = await throwDice(dice, userChecker)

    if (ws && wsGood(ws)) {
      const context = {
        physics: true,
        user: {
          user: {
            id: players.me.id,
            name: players.me.name,
            color: userChecker,
          },
          physics,
        },
      }
      ws.send(JSON.stringify(context))
    }
  }, [])

  // Loading the collision audio for the dice
  useEffect(() => {
    useGameStore.setState({ throwDice: throwDiceFunc })

    const audioLoader = new AudioLoader()
    const listener = new AudioListener()
    camera.add(listener)

    audioLoader.load("/sounds/new-dice.wav", buffer => {
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
    if (showThrowBtn && sleeping.dice1 && sleeping.dice2) {
      useGameStore.setState({ showThrow: true })
    } else if (showThrowBtn) {
      useGameStore.setState({ showThrow: false })
    } else {
      useGameStore.setState({ showThrow: null })
    }
  }, [showThrowBtn, sleeping])

  // Game logic: Handling the dice throws
  useEffect(() => {
    // Dice have not finished throwing
    if (!finishedThrow || !finishedThrow.dice1 || !finishedThrow.dice2) return

    // The game websocket
    const ws = useGameStore.getState().ws

    // Check if user has any valid moves
    const moves = hasMoves()

    // User has no moves
    if (!moves) {
      useGameStore.setState(state => ({
        userChecker: switchPlayers(state.userChecker!),
        dice: { dice1: 0, dice2: 0, moves: 0 },
      }))

      // Set the phase to diceRoll
      if (!ws) {
        useGameStore.setState({ phase: "diceRollAgain" })
        setShowThrowBtn(true)
      } else {
        updateLiveGame()
      }

      // Show a message that the user has no valid moves
      setShow(true)
      return
    }

    // If the dice numbers match, user can move 4 times, otherwise 2
    const dice = useGameStore.getState().dice
    if (dice.moves === 0 && dice.dice1 !== 0 && dice.dice2 !== 0) {
      useGameStore.setState(curr => ({
        dice: { ...curr.dice, moves: dice.dice1 === dice.dice2 ? 4 : 2 },
      }))
    }

    // Updating the backend
    ws && updateLiveGame()

    useGameStore.setState({ phase: "checkerMove" })
  }, [finishedThrow])

  // Game logic: Handling the phase changes
  useEffect(() => {
    const dicePhysics = useGameStore.getState().dicePhysics
    let timeout: NodeJS.Timeout

    // User already has dice physics, and it's their turn, and they don't have the numbers on the dice saved
    if (phase === "diceRollPhysics") {
      timeout = setTimeout(() => {
        if (!dicePhysics) return

        throwDicePhysics([dice1.current, dice2.current], dicePhysics.physics)
      }, 2000)
      setShowThrowBtn(false)
      return
    }

    // If our dice are being synced with the other user
    if (phase === "diceSync" && dicePhysics) {
      throwDicePhysics([dice1.current, dice2.current], dicePhysics.physics)
      return
    }

    /**
     * ORDER IMPORTANT: (1) initial (2) ended (3) diceRoll or diceRollAgain
     */
    const myTurn = useGameStore.getState().myTurn

    if (phase === "initial") {
      const gameMode = useGameStore.getState().gameMode

      if (!myTurn && gameMode === "friend-game") return

      // User has initially connected to the game, with no available/previous dice moves
      const dice = useGameStore.getState().dice
      if (dice.moves === 0) setShowThrowBtn(true)
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

    return () => {
      clearTimeout(timeout)
    }
  }, [phase])

  return (
    <>
      <Html>
        <Modal setOpen={setShow} open={show} className="min-w-[300px]">
          You don&apos;t have a move!
        </Modal>
      </Html>

      {/* Dice Holder */}
      <CuboidCollider args={[0.5, 0.1, 0.5]} position={[0, 0.4, 2]} />

      <Die
        ref={dice1}
        index={0}
        position={DICE_1_DEFAULT_POS}
        setFinishedThrow={setFinishedThrow}
        setSleeping={setSleeping}
        showThrowBtn={showThrowBtn}
        audio={audio}
      />
      <Die
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
