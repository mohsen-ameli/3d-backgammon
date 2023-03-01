import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { CuboidCollider, RigidBody, RigidBodyApi } from "@react-three/rapier"
import { useThree } from "@react-three/fiber"
import { useDrag, UserDragConfig } from "@use-gesture/react"
import { useSpring, animated } from "@react-spring/three"
import { GameState } from "../Game"
import getCheckerPos from "../utils/GetCheckerPos"
import getCheckersOnCol from "../utils/GetCheckersOnCol"
import lenRemovedCheckers from "../utils/LenRemovedCheckers"
import switchPlayers from "../utils/SwitchPlayers"
import Endgame from "../utils/Endgame"
import GameWon from "../utils/GameWon"
import hasMoves from "../utils/HasMoves"
import notification from "../../components/utils/Notification"
import toCapitalize from "../../components/utils/ToCapitalize"
import { AuthContext } from "../../context/AuthContext"
import { Mesh, MeshStandardMaterial, Vector3 } from "three"
import { CheckerType } from "../types/Checker.type"
import ValidateMove from "./ValidateMove"

type CheckerProps = {
  thisChecker: CheckerType
}

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
  } = useContext(GameState)
  const { user } = useContext(AuthContext)

  // Checkers
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width

  const checker = useRef<RigidBodyApi>(null!)

  // Checker's position
  const [pos, setPos] = useState<number[] | Vector3>([0, 0, 0])

  // Spring animation for dragging
  const [spring, set] = useSpring(() => ({
    rotation: [-3, -4].includes(thisChecker.col)
      ? [Math.PI / 3, 0, 0]
      : [0, 0, 0],
    position: pos,
    config: { mass: 1, friction: 37, tension: 800 },
  }))

  // When the checker is mounted, set its position
  useEffect(() => {
    // New position for the checker
    const position = getCheckerPos(thisChecker)
    setPos(position)

    // Setting the checker's mesh position (not the physics)
    const rotation = [-3, -4].includes(thisChecker.col)
      ? [Math.PI / 3, 0, 0]
      : [0, 0, 0]
    set({ position, rotation })

    // Setting the checker's physics position
    checker.current.setTranslation({
      x: position[0],
      y: position[1],
      z: position[2],
    })
  }, [thisChecker, thisChecker.removed])

  // Some config for the useDrag
  const dragConfig: UserDragConfig = {
    from: () => {
      const from = spring.position.get() as number[]
      return [from[0] * aspect, from[2] * aspect]
    },
    eventOptions: { capture: false, passive: true },
  }

  const goToOriginalPos = (currentChecker: CheckerType) => {
    const oldPosition = getCheckerPos(currentChecker)
    set({ position: oldPosition })
  }

  // When a checker is picked up (dragged) and released
  // This is where the main logic for the game is
  const bind = useDrag(({ event, offset: [x, y], dragging }) => {
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
      // If the user is dragging a checker from the removed column,
      // stop the other checkers from being dragged (if there are multiple
      // checkers in the removed column, they get stacked)
      let i = 0
      // @ts-ignore
      // prettier-ignore
      event.intersections.map((inter) => {
        if (((inter.object as Mesh).material as MeshStandardMaterial).name.includes("Column"))
          i++
      })
      if (thisChecker.col < 0 && i === 0) event.stopPropagation()

      toggleControls.current(false, true)
      checkerPicked.current = true

      // Setting the checker's mesh position (not the physics)
      set({ position: [x / aspect, 0.2, y / aspect] })
    } else {
      toggleControls.current()
      checkerPicked.current = false

      // Number of removed checkers of the current player/user
      const removedCheckersLen = lenRemovedCheckers(
        checkers.current,
        userChecker.current
      )

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
       * User is tring to move to the end columns
       */
      if ([-3, -4].includes(to)) {
        const end = Endgame(checkers.current, userChecker.current)
        if (!end) return // Not in endgame yet

        const validMove = ValidateMove(
          checkers.current,
          thisChecker,
          dice.current,
          moved
        )
        if (!validMove) {
          goToOriginalPos(currentChecker)
          return
        }

        const checkersOnEndCol = checkers.current.filter(
          (checker) => checker.col === to
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
        set({ position: positions, rotation: [Math.PI / 3, 0, 0] })
        notification(`${toCapitalize(userChecker.current!)} is the winner!`)

        return
      }

      /**
       * User is trying to move to a column within the board
       */
      const { action, numCheckers, rmChecker } = getCheckersOnCol(checkers.current, to, thisChecker.color) // prettier-ignore

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
      } else currentChecker.row = numCheckers // updating this checker

      // End of logic... phew!
      updateStuff(getCheckerPos(thisChecker), moved)
      return
    }
  }, dragConfig)

  // Updating backend
  const updateStuff = (
    newPositions: number[],
    moved: number,
    rotation: number[] = [0, 0, 0]
  ) => {
    // Setting the checker's mesh position
    set({ position: newPositions, rotation })

    // Setting the checker's physics position
    checker.current.setTranslation({
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
      notification("You don't have a move!", "error")
      return
    }

    // Updating the user that is playing, and the phase
    if (dice.current.moves === 0) {
      userChecker.current = switchPlayers(userChecker.current!)
      !ws && setPhase("diceRoll")
    } else {
      // Making sure there's a rerender everytime the user moves
      // We have to make sure that user is not playing a live game
      // since in a live game, this exact same code gets run (check
      // useEffect with ws deppendency in Game)
      !ws &&
        setPhase((curr) =>
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

  // Updating the current game instance
  const updateLiveGame = () => {
    if (!ws) return

    const context = {
      update: true,
      board: checkers.current,
      dice: dice.current,
      turn: userChecker.current,
    }
    ws.send(JSON.stringify(context))
  }

  return (
    <>
      <RigidBody
        ref={checker}
        type="kinematicPosition"
        position={pos as Vector3}
      >
        <CuboidCollider args={[0.08, 0.06, 0.08]} position={[0, 0.06, 0]} />
      </RigidBody>

      {/* @ts-ignore: SpringValue type is a Vector3, but TypeScript won't allow it */}
      <animated.mesh
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
