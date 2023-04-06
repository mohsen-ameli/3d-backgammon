import { a as a3f, useSpring } from "@react-spring/three"
import { Html } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { CuboidCollider, RigidBody, RigidBodyApi } from "@react-three/rapier"
import { UserDragConfig, useDrag } from "@use-gesture/react"
import { useContext, useEffect, useRef, useState } from "react"
import { Vector3 } from "three"
import { AuthContext } from "../../context/AuthContext"
import { GameContext } from "../context/GameContext"
import { BOARD_W, CHECKER_W, GROUND_CHECKERS } from "../data/Data"
import { CheckerType } from "../types/Checker.type"
import Modal from "../ui/Modal"
import Endgame from "../utils/Endgame"
import hasMoves from "../utils/HasMoves"
import lenRemovedCheckers from "../utils/LenRemovedCheckers"
import switchPlayers from "../utils/SwitchPlayers"
import useGetCheckersOnCol from "../utils/useGetCheckersOnCol"
import useUpdateLiveGame from "../utils/useUpdateLiveGame"
import CheckersSort from "./utils/CheckersSort"
import GameWon from "./utils/GameWon"
import getCheckerPos from "./utils/GetCheckerPos"
import ValidateMove from "./utils/ValidateMove"

type CheckerProps = {
  thisChecker: CheckerType
}

type PosType = [number, number, number] | Vector3 | number[]

/**
 * A single checker. This is where the magic takes place.
 * Most of the game logic is implemented here.
 */
const Checker = ({ thisChecker }: CheckerProps) => {
  const {
    ws,
    checkerPicked,
    nodes,
    materials,
    newCheckerPosition,
    dice,
    checkers,
    userChecker,
    phase,
    setPhase,
    toggleControls,
    setInGame,
    initial,
  } = useContext(GameContext)
  const { user } = useContext(AuthContext)

  // Utilities
  const { updateLiveGame } = useUpdateLiveGame()
  const { getCheckersOnCol } = useGetCheckersOnCol()

  // Checkers
  const { viewport } = useThree()
  const { factor } = viewport

  // This checker's rigid body instance
  const checker = useRef<RigidBodyApi>(null)

  // Showing the invalid move panel
  const [show, setShow] = useState(false)

  // Checker's position
  const [pos, setPos] = useState<PosType>([
    -(BOARD_W + (CHECKER_W * 5.6) / 4) - 0.01,
    GROUND_CHECKERS + 0.15,
    thisChecker.color === "white"
      ? 0.22 + 0.04 * (thisChecker.id + 1)
      : 0.38 - 0.04 * (thisChecker.id + 1),
  ])

  // Spring animation for dragging
  const [spring, springApi] = useSpring(() => ({
    rotation:
      [-3, -4].includes(thisChecker.col) || !initial.doneLoading
        ? [Math.PI / 3, 0, 0]
        : [0, 0, 0],
    position: pos,
    config: { mass: 1, friction: 28, tension: 400 },
  }))

  // Showing an animation when the checkers first load in
  useEffect(() => {
    // If we are not done loading, meaning the camera is still coming on top of the board, then return
    if (!initial.doneLoading) return

    // New position for the checker
    const position = getCheckerPos(thisChecker)
    setPos(position)

    // Setting the checker's mesh position (not the physics)
    const rotation = [-3, -4].includes(thisChecker.col)
      ? [Math.PI / 3, 0, 0]
      : [0, 0, 0]

    const animate = async () => {
      const x = thisChecker.id + 1

      await new Promise(resolve => setTimeout(resolve, 200 * x))

      springApi.start({
        // @ts-ignore
        position: [pos[0], 0.05, pos[2]],
        rotation: [0, 0, 0],
      })

      await new Promise(resolve => setTimeout(resolve, 10 * x))

      springApi.start({ position, rotation })
    }

    animate()
  }, [initial])

  // When the checker is mounted, set its position
  useEffect(() => {
    // If the checkers have just been loaded, return so that the entering animation can be played.
    if (initial.initialLoad) return

    // New position for the checker
    const position = getCheckerPos(thisChecker)
    setPos(position)

    // Setting the checker's mesh position (not the physics)
    const rotation = [-3, -4].includes(thisChecker.col)
      ? [Math.PI / 3, 0, 0]
      : [0, 0, 0]

    // Setting checker's mesh position
    springApi.start({ position, rotation })

    // Setting the checker's physics position
    checker.current?.setTranslation({
      x: position[0],
      y: position[1],
      z: position[2],
    })
  }, [thisChecker.col, thisChecker.row, thisChecker.removed])

  const goToOriginalPos = (currentChecker: CheckerType) => {
    const oldPosition = getCheckerPos(currentChecker)
    springApi.start({ position: oldPosition })
  }

  // Some config for the useDrag
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
    // Check to see if the user is allowed to move
    if (
      !["checkerMoveAgain", "checkerMove"].includes(phase!) ||
      dice.current.moves === 0 ||
      thisChecker.color !== userChecker.current ||
      [-3, -4].includes(thisChecker.col)
    )
      return

    // User started dragging the checker
    if (dragging) {
      // If the user is dragging multiple checkers, then stop the drag
      // prettier-ignore
      if (checkerPicked.current && checkerPicked.current.id !== thisChecker.id) {
        cancel()
        return
      } else {
        checkerPicked.current = thisChecker
      }

      toggleControls.current("checkerDisable")

      springApi.start({ position: [x / factor, 0, y / factor] })
      return
    }

    toggleControls.current("checkerEnable")
    checkerPicked.current = null

    // Current checker instance
    const currentChecker = checkers.current[thisChecker.id]

    // From, to, and moved column numbers
    const to = newCheckerPosition.current!
    let from
    let moved

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
      const end = Endgame(checkers.current, userChecker.current)
      if (!end) return // Not in endgame yet

      // Validating the move
      const validMove = ValidateMove(checkers.current, thisChecker, dice.current, moved) //prettier-ignore
      if (!validMove) {
        goToOriginalPos(currentChecker)
        return
      }

      const checkersOnEndCol = checkers.current.filter(
        checker => checker.col === to
      )
      const checker_ = {
        col: to,
        row: checkersOnEndCol.length,
        removed: false,
      } as CheckerType
      const positions = getCheckerPos(checker_)

      // Saving the new position of the checker
      currentChecker.col = to
      currentChecker.row = checkersOnEndCol.length
      currentChecker.removed = false

      // Checking if user has won
      const possibleWinner = userChecker.current!
      const won = GameWon(checkers.current, possibleWinner)
      if (!won) {
        updateStuff(positions, moved, [Math.PI / 3, 0, 0])
        return
      }

      /**
       * !! User has won the game wohoo !!
       */
      if (ws) {
        updateGameWinner()
        return
      }
      setPhase("ended")
      userChecker.current! = possibleWinner
      springApi.start({ position: positions, rotation: [Math.PI / 3, 0, 0] })
      setInGame(false)

      return
    }

    /**
     * User is trying to move to a column within the board
     */
    const { action, numCheckers, rmChecker } = getCheckersOnCol(to, thisChecker.color) // prettier-ignore
    const removedCheckersLen = lenRemovedCheckers(checkers.current, userChecker.current) // prettier-ignore

    // If user is moving wrongly, move them back to their original position
    if (
      action === "invalid" ||
      isNaN(moved) ||
      moved <= 0 ||
      ![dice.current.dice1, dice.current.dice2].includes(moved) ||
      (removedCheckersLen <= 0 && thisChecker.removed) ||
      (removedCheckersLen !== 0 && !thisChecker.removed)
    ) {
      goToOriginalPos(currentChecker)
      return
    }

    /**
     * User is making a valid move. Nice..
     */
    currentChecker.col = to // updating this checker
    currentChecker.removed = false // updating this checker

    // User is removing a checker
    if (action === "remove" && rmChecker) {
      currentChecker.row = numCheckers - 1 // updating this checker

      // Removed checker instance
      const removedChecker = checkers.current[rmChecker.id]

      // Saving the new position of the removed checker
      removedChecker.col = rmChecker.color === "white" ? -1 : -2
      removedChecker.row = lenRemovedCheckers(checkers.current, rmChecker.color) //prettier-ignore
      removedChecker.removed = true
    } else {
      currentChecker.row = numCheckers // updating this checker
    }

    CheckersSort(checkers.current, from)

    // Update states and backend
    const newPos = getCheckerPos(thisChecker)
    updateStuff(newPos, moved)

    // End of logic... phew!
    return
  }, dragConfig)

  // Update states and backend
  const updateStuff = (
    newPositions: number[],
    moved: number,
    rotation: number[] = [0, 0, 0]
  ) => {
    // Setting the checker's mesh position
    springApi.start({ position: newPositions, rotation })

    // Setting the checker's physics position
    checker.current?.setTranslation({
      x: newPositions[0],
      y: newPositions[1],
      z: newPositions[2],
    })

    // Updating the dice
    dice.current.moves--
    if (dice.current.moves < 2) {
      if (dice.current.dice1 === moved) dice.current.dice1 = 0
      else dice.current.dice2 = 0
    }

    // Check if user has any valid moves
    const moves = hasMoves(checkers.current, dice.current, userChecker.current!)

    // If the user has no valid moves
    if (!moves) {
      userChecker.current = switchPlayers(userChecker.current!)

      // Reset the dice moves
      dice.current = { dice1: 0, dice2: 0, moves: 0 }

      // Set the phase to diceRoll
      if (!ws) setPhase("diceRoll")
      else updateLiveGame()

      // Show a message that the user has no valid moves
      setShow(true)
      return
    }

    // Updating the user that is playing, and the phase
    if (dice.current.moves === 0) {
      userChecker.current = switchPlayers(userChecker.current!)
      !ws && setPhase("diceRoll")
    } else {
      // Making sure there's a rerender every time the user moves
      // We have to make sure that user is not playing a live game
      // since in a live game, this exact same code gets run (check
      // useEffect with ws dependency in Game)
      !ws &&
        setPhase(curr =>
          curr === "checkerMove" ? "checkerMoveAgain" : "checkerMove"
        )
    }

    // Updating the backend
    ws && updateLiveGame()
  }

  // Sends a call to set the winner of the game
  const updateGameWinner = () => {
    if (!ws || !user) return

    const context = { finished: true, winner: user.user_id }
    ws.send(JSON.stringify(context))
  }

  return (
    <>
      <Html>
        <Modal setOpen={setShow} open={show}>
          You don't have a move!
        </Modal>
      </Html>

      <RigidBody
        ref={checker}
        type="kinematicPosition"
        position={pos as Vector3}
      >
        <CuboidCollider args={[0.08, 0.015, 0.08]} position={[0, 0.015, 0]} />
      </RigidBody>

      {/* @ts-ignore: SpringValue type is a Vector3, but TypeScript won't allow it */}
      <a3f.mesh
        {...spring}
        {...bind()}
        name="WhiteChecker"
        castShadow
        geometry={nodes.WhiteChecker.geometry}
        material={
          thisChecker.color === "white"
            ? materials.WhiteCheckerMat
            : materials.DarkCheckerMat
        }
        onPointerEnter={() => (document.body.style.cursor = "grab")}
        onPointerLeave={() => (document.body.style.cursor = "default")}
      />
    </>
  )
}

export default Checker
