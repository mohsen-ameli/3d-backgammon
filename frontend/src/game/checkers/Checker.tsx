import { a as a3f, useSpring } from "@react-spring/three"
import { Html } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { CuboidCollider, RigidBody, RigidBodyApi } from "@react-three/rapier"
import { UserDragConfig, useDrag } from "@use-gesture/react"
import { useEffect, useRef, useState } from "react"
import { Vector3 } from "three"
import { BOARD_W, CHECKER_W, GROUND_CHECKERS } from "../data/Data"
import { CheckerType } from "../types/Checker.type"
import Endgame from "../utils/Endgame"
import hasMoves from "../utils/HasMoves"
import lenRemovedCheckers from "../utils/LenRemovedCheckers"
import switchPlayers from "../utils/SwitchPlayers"
import GameWon from "./utils/GameWon"
import getCheckerPos from "./utils/GetCheckerPos"
import ValidateMove from "./utils/ValidateMove"
import { useSession } from "next-auth/react"
import Modal from "@/components/ui/Modal"
import { useGameStore } from "../store/useGameStore"
import { shallow } from "zustand/shallow"
import getCheckersOnCol from "../utils/getCheckersOnCol"
import updateLiveGame from "../utils/updateLiveGame"
import SortCheckers from "./utils/SortCheckers"

type PosType = [number, number, number] | Vector3 | number[]

/**
 * A single checker. This is where the magic takes place.
 * Most of the game logic is implemented here.
 */
const Checker = ({ thisChecker }: { thisChecker: CheckerType }) => {
  const ws = useGameStore.getState().ws
  const nodes = useGameStore.getState().nodes
  const materials = useGameStore.getState().materials
  const initial = useGameStore(state => state.initial, shallow)
  const checkers = useGameStore(state => state.checkers, shallow)!

  const { data: session } = useSession()
  const user = session?.user

  // Checkers
  const { viewport } = useThree()
  const { factor } = viewport

  // This checker's rigid body instance
  const checker = useRef<RigidBodyApi>(null!)

  // Showing the invalid move panel
  const [show, setShow] = useState(false)

  // Checker's position
  const [pos, setPos] = useState<PosType>([
    -(BOARD_W + (CHECKER_W * 5.6) / 4) - 0.01,
    GROUND_CHECKERS + 0.15,
    thisChecker.color === "white" ? 0.22 + 0.04 * (thisChecker.id + 1) : 0.38 - 0.04 * (thisChecker.id + 1),
  ])

  // Spring animation for dragging
  const [spring, springApi] = useSpring(() => ({
    rotation: [-3, -4].includes(thisChecker.col) || !initial?.doneLoading ? [Math.PI / 3, 0, 0] : [0, 0, 0],
    position: pos,
    config: { mass: 1, friction: 28, tension: 400 },
  }))

  // Showing an animation when the checkers first load in
  useEffect(() => {
    // If we are not done loading, meaning the camera is still coming on top of the board, then return
    if (!initial || !initial.doneLoading) return

    // New position and rotation for the this checker
    const position = getCheckerPos(thisChecker)
    const rotation = [-3, -4].includes(thisChecker.col) ? [Math.PI / 3, 0, 0] : [0, 0, 0]

    setPos(position)

    async function animate() {
      const x = thisChecker.id + 1

      await new Promise(resolve => setTimeout(resolve, 200 * x))

      springApi.start({
        // @ts-ignore
        position: [pos[0], 0.05, pos[2]],
        rotation: [0, 0, 0],
      })

      await new Promise(resolve => setTimeout(resolve, 10 * x))

      springApi.start({ position, rotation })

      checker.current?.setTranslation({
        x: position[0],
        y: position[1],
        z: position[2],
      })
    }

    animate()
  }, [initial])

  // When the checker is mounted, set its position and rotation
  useEffect(() => {
    // If the checkers have just been loaded, return so that the entering animation can be played.
    if (!initial || initial.initialLoad) return

    // New position for the checker
    const position = getCheckerPos(thisChecker)
    setPos(position)

    // Setting the checker's mesh position (not the physics)
    const rotation = [-3, -4].includes(thisChecker.col) ? [Math.PI / 3, 0, 0] : [0, 0, 0]

    // Setting checker's mesh position
    springApi.start({ position, rotation })

    // Setting the checker's physics position
    checker.current?.setTranslation({
      x: position[0],
      y: position[1],
      z: position[2],
    })
  }, [thisChecker.col, thisChecker.row, thisChecker.removed])

  // Config for the useDrag
  const dragConfig: UserDragConfig = {
    from: () => {
      const from = spring.position.get() as number[]
      return [from[0] * factor, from[2] * factor]
    },
    eventOptions: { capture: false, passive: true },
  }

  // When a checker is picked up (dragged) and released
  // This is where the main logic for the game is
  const bind = useDrag(({ offset: [x, y], dragging, cancel }) => {
    const userChecker = useGameStore.getState().userChecker!
    const phase = useGameStore.getState().phase!
    const toggleControls = useGameStore.getState().toggleControls!
    const checkerPicked = useGameStore.getState().checkerPicked!
    const dice = useGameStore.getState().dice!
    const newCheckerPosition = useGameStore.getState().newCheckerPosition!

    // Check to see if the user is allowed to move
    if (
      !["checkerMoveAgain", "checkerMove"].includes(phase) ||
      dice.moves === 0 ||
      thisChecker.color !== userChecker ||
      [-3, -4].includes(thisChecker.col)
    )
      return

    // User started dragging the checker
    if (dragging) {
      // If the user is dragging multiple checkers, then stop the drag
      if (checkerPicked && checkerPicked.id !== thisChecker.id) {
        cancel()
        return
      } else {
        useGameStore.setState({ checkerPicked: thisChecker })
      }

      toggleControls("checkerDisable")

      springApi.start({ position: [x / factor, 0, y / factor] })
      return
    }

    toggleControls("checkerEnable")
    useGameStore.setState({ checkerPicked: null })

    // From, to, and moved column numbers
    const to = newCheckerPosition as number
    let from: number
    let moved: number

    if (thisChecker.col === -1) from = -1
    else if (thisChecker.col === -2) from = 24
    else from = thisChecker.col

    if (to === -3) moved = 24 - from
    else if (to === -4) moved = from + 1
    else moved = thisChecker.color === "white" ? to - from : from - to

    /**
     * User is trying to bear off their checker
     */
    if ([-3, -4].includes(to)) {
      // If user is in an endgame
      const end = Endgame(userChecker)
      if (!end) return

      // Validating the move
      if (!ValidateMove(thisChecker, moved)) {
        goToOriginalPos(thisChecker)
        return
      }

      const checkersOnEndCol = checkers.filter(checker => checker.col === to)
      const checker_ = {
        col: to,
        row: checkersOnEndCol.length,
        removed: false,
      } as CheckerType
      const positions = getCheckerPos(checker_)

      // Saving the new position of the checker
      thisChecker.col = to
      thisChecker.row = checkersOnEndCol.length
      thisChecker.removed = false

      // @ts-ignore Updating state
      useGameStore.setState(curr => ({ checkers: [...curr.checkers, thisChecker] }))

      // Sorting the checkers
      SortCheckers(from)

      // Checking if user has won
      const possibleWinner = userChecker

      if (!GameWon(possibleWinner)) {
        updateStuff(moved)
        return
      }

      /**
       * !! User has won the game wohoo !!
       */
      if (ws) {
        updateGameWinner()
        return
      }
      useGameStore.setState({ phase: "ended", userChecker: possibleWinner, inGame: false })
      springApi.start({ position: positions, rotation: [Math.PI / 3, 0, 0] })

      return
    }

    /**
     * User is trying to move to a column within the board
     */
    const { action, numCheckers, rmChecker } = getCheckersOnCol(to, thisChecker.color)
    const removedCheckersLen = lenRemovedCheckers(userChecker)

    // If user is moving wrongly, move them back to their original position
    if (
      action === "invalid" ||
      isNaN(moved) ||
      moved <= 0 ||
      ![dice.dice1, dice.dice2].includes(moved) ||
      (removedCheckersLen <= 0 && thisChecker.removed) ||
      (removedCheckersLen !== 0 && !thisChecker.removed)
    ) {
      goToOriginalPos(thisChecker)
      return
    }

    /**
     * User is making a valid move. Nice..
     */
    if (action === "remove" && rmChecker) {
      // Updating removed checker
      rmChecker.col = rmChecker.color === "white" ? -1 : -2
      rmChecker.row = lenRemovedCheckers(rmChecker.color)
      rmChecker.removed = true
    }

    // Updating this checker
    thisChecker.col = to
    thisChecker.row = action === "remove" ? numCheckers - 1 : numCheckers
    thisChecker.removed = false

    // Updating state
    useGameStore.setState(curr => ({
      checkers: curr.checkers?.map(checker =>
        checker.id === thisChecker.id ? { ...thisChecker } : checker.id === rmChecker?.id ? { ...rmChecker } : checker,
      ),
    }))

    // Sorting the checkers
    SortCheckers(from)

    // Update states and backend
    updateStuff(moved)

    // End of logic... phew!
    return
  }, dragConfig)

  /**
   * Goes back to the original position of the checker
   */
  function goToOriginalPos(currentChecker: CheckerType) {
    const oldPosition = getCheckerPos(currentChecker)
    springApi.start({ position: oldPosition })
  }

  /**
   * Update states and backend
   */
  function updateStuff(moved: number) {
    const dice = useGameStore.getState().dice

    // Updating the dice
    const newDice = dice
    newDice.moves--
    if (newDice.moves < 2) {
      if (newDice.dice1 === moved) newDice.dice1 = 0
      else newDice.dice2 = 0
    }

    useGameStore.setState({ dice: newDice })

    // Check if user has any valid moves
    const moves = hasMoves()

    // If the user has no valid moves
    if (!moves) {
      useGameStore.setState(state => ({
        userChecker: switchPlayers(state.userChecker!),
        dice: { dice1: 0, dice2: 0, moves: 0 },
      }))

      // Set the phase to diceRoll
      if (!ws) useGameStore.setState({ phase: "diceRoll" })
      else updateLiveGame()

      // Show a message that the user has no valid moves
      setShow(true)
      return
    }

    // Updating the user that is playing, and the phase
    if (newDice.moves === 0) {
      useGameStore.setState(state => ({ userChecker: switchPlayers(state.userChecker!) }))
      !ws && useGameStore.setState({ phase: "diceRoll" })
    } else {
      // Making sure there's a rerender every time the user moves
      // We have to make sure that user is not playing a live game
      // since in a live game, this exact same code gets run (check
      // useEffect with ws dependency in Game)

      if (!ws) {
        useGameStore.setState(state => ({
          phase: state.phase === "checkerMove" ? "checkerMoveAgain" : "checkerMove",
        }))
      }
    }

    // Updating the backend
    ws && updateLiveGame()
  }

  /**
   * Sends a call to set the winner of the game
   */
  function updateGameWinner() {
    if (!ws || !user) return

    const context = { finished: true, winner: user.id }
    ws.send(JSON.stringify(context))
  }

  if (!nodes || !materials) return <></>

  return (
    <>
      <Html>
        <Modal setOpen={setShow} open={show}>
          You don&apos;t have a move!
        </Modal>
      </Html>

      <RigidBody ref={checker} type="kinematicPosition" position={pos as Vector3}>
        <CuboidCollider args={[0.08, 0.015, 0.08]} position={[0, 0.015, 0]} />
      </RigidBody>

      {/* @ts-ignore: SpringValue type is a Vector3, but TypeScript won't allow it */}
      <a3f.group
        {...spring}
        onPointerOver={e => {
          e.stopPropagation()
          document.body.style.cursor = "grab"
        }}
        onPointerOut={() => (document.body.style.cursor = "default")}
      >
        {/* Invisible box surrounding the checkers so the user can easily drag each checker */}
        {/* @ts-ignore: SpringValue type is a Vector3, but TypeScript won't allow it */}
        <a3f.mesh {...bind()}>
          <boxGeometry args={[0.3, 0.06, 0.2]} />
          <meshNormalMaterial visible={false} />
        </a3f.mesh>

        <a3f.mesh
          name="WhiteChecker"
          castShadow
          geometry={nodes.WhiteChecker.geometry}
          material={thisChecker.color === "white" ? materials.WhiteCheckerMat : materials.DarkCheckerMat}
        />
      </a3f.group>
    </>
  )
}

export default Checker
