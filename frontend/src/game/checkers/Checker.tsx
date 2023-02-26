import { useContext, useEffect, useRef, useState } from "react"
import { CuboidCollider, RigidBody, RigidBodyApi } from "@react-three/rapier"
import { useThree } from "@react-three/fiber"
import { useDrag } from "@use-gesture/react"
import { useSpring, a, animated } from "@react-spring/three"
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

type CheckerProps = {
  thisChecker: CheckerType
}

/**
 * A single checker. This is where the magic takes place. Most of the
 * game logic is implemented here.
 */
const Checker = ({ thisChecker }: CheckerProps) => {
  const { user } = useContext(AuthContext)

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

  const checker = useRef<RigidBodyApi>(null!)

  // local state for every checker
  const [pos, setPos] = useState<number[] | Vector3>([0, 0, 0])
  const [, rerender] = useState(false)

  // Checkers
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width

  // When a checker is removed, update its position
  useEffect(() => {
    // New position for the checker
    const newPos = getCheckerPos(
      thisChecker.col,
      thisChecker.row,
      thisChecker.removed
    )
    // Setting the new position of the checker when it gets removed
    setPos(newPos)
    rerender((curr) => !curr)

    // Setting the checker's mesh position (not the physics)
    const rotation =
      thisChecker.col === -3 || thisChecker.col === -4
        ? [Math.PI / 3, 0, 0]
        : [0, 0, 0]
    set({ position: newPos, rotation })

    // Setting the checker's physics position
    checker.current.setTranslation({
      x: newPos[0],
      y: newPos[1],
      z: newPos[2],
    })
  }, [thisChecker, thisChecker.removed])

  // Spring animation for dragging
  const [spring, set] = useSpring(() => ({
    rotation:
      thisChecker.col === -3 || thisChecker.col === -4
        ? [Math.PI / 3, 0, 0]
        : [0, 0, 0],
    position: pos,
    config: { mass: 1, friction: 37, tension: 800 },
  }))

  // When a checker is picked up (dragged)
  // This is where the main logic for the game is
  const bind = useDrag(
    (state) => {
      const {
        event,
        offset: [x, y],
        dragging,
      } = state

      const allowedPhases = ["checkerMoveAgain", "checkerMove"]

      // Check to see if the user is allowed to move
      if (
        !allowedPhases.includes(phase!) ||
        dice.current.moves === 0 ||
        thisChecker.color !== userChecker.current ||
        thisChecker.col === -3 ||
        thisChecker.col === -4
      )
        return

      // User started dragging the checker
      if (dragging) {
        // If the user is dragging a checker from the removed column,
        // stop the other checkers from being dragged (if there are multiple
        // checkers in the removed column, they get stacked)
        let i = 0

        // @ts-ignore
        event.intersections.map((inter) => {
          if (
            (
              (inter.object as Mesh).material as MeshStandardMaterial
            ).name.includes("Column")
          )
            i++
        })
        if (thisChecker.col < 0 && i === 0) event.stopPropagation()

        // Switching orbit controls
        toggleControls.current(false, true)

        // The checker has been picked up
        checkerPicked.current = true

        // Setting the checker's mesh position (not the physics)
        set({ position: [x / aspect, 0.2, y / aspect] })
      }
      // Finished dragging (Main logic of the game)
      else {
        // Enabling orbit controls
        toggleControls.current()
        checkerPicked.current = false

        // Number of removed checkers of the current player/user
        const removedCheckersLen = lenRemovedCheckers(
          checkers.current,
          userChecker.current
        )

        // From and to column number
        let from
        if (thisChecker.col === -1) {
          from = -1
        } else if (thisChecker.col === -2) {
          from = 24
        } else {
          from = thisChecker.col
        }
        const to = newCheckerPosition.current!
        let moved
        if (to === -3) {
          moved = 24 - from
        } else if (to === -4) {
          moved = from + 1
        } else {
          moved = thisChecker.color === "white" ? to - from : from - to
        }

        // Current checker instance
        const currentChecker = checkers.current[thisChecker.id]

        // User is trying to move their checker outside the board
        if (to === -3 || to === -4) {
          const end = Endgame(checkers.current, userChecker.current)
          if (end) {
            // Getting the number of checkers in the back of the current checker
            let backRankCheckers
            if (thisChecker.color === "black") {
              backRankCheckers = checkers.current.filter(
                (checker) =>
                  checker.col > thisChecker.col &&
                  checker.color === thisChecker.color
              ).length
            } else {
              backRankCheckers = checkers.current.filter(
                (checker) =>
                  checker.col >= 18 &&
                  checker.col < thisChecker.col &&
                  checker.color === thisChecker.color
              ).length
            }

            let validMove = false

            // If there are no checkers behind the current checker,
            // and the dice number is greater than the how much the user moved
            if (
              backRankCheckers === 0 &&
              (dice.current.dice1 >= moved || dice.current.dice2 >= moved)
            ) {
              if (dice.current.dice1 > dice.current.dice2) {
                moved = dice.current.dice1
              } else {
                moved = dice.current.dice2
              }
              validMove = true
            }
            // The user has moved directly outside
            else if (
              dice.current.dice1 === moved ||
              dice.current.dice2 === moved
            ) {
              validMove = true
            }

            if (validMove) {
              const checkersOnEndCol = checkers.current.filter(
                (checker) => checker.col === to
              )
              const positions = getCheckerPos(to, checkersOnEndCol.length)

              // Saving the new position of the checker
              currentChecker.col = to
              currentChecker.row = checkersOnEndCol.length
              currentChecker.removed = false

              // Checking if user has won
              const possibleWinner = userChecker.current!

              const won = GameWon(checkers.current, possibleWinner)
              if (won) {
                if (ws) {
                  updateGameWinner()
                  return
                }
                setPhase("ended")
                userChecker.current! = possibleWinner
                set({ position: positions, rotation: [Math.PI / 3, 0, 0] })
                notification(
                  `${toCapitalize(userChecker.current!)} is the winner!`
                )
              } else {
                updateStuff(positions, moved, [Math.PI / 3, 0, 0])
              }

              return
            }
          }
        }

        // User is moving their checker within the board
        if (
          // The user isn't going to the moon
          !isNaN(moved) &&
          // They are moving in the right direction (not backwards)
          moved > 0 &&
          // The user is moving by whatever the number on the dice is
          (dice.current.dice1 === moved || dice.current.dice2 === moved) &&
          // Enforcing the user to move the removed checker *first*
          ((removedCheckersLen > 0 && thisChecker.removed) ||
            (removedCheckersLen === 0 && !thisChecker.removed))
        ) {
          // prettier-ignore
          // Checking if the user is going to a valid position
          const { action, numCheckers, rmChecker } = getCheckersOnCol(checkers.current, to, thisChecker.color)

          // User is moving invalidly ..?
          if (action === "invalid") {
            // Show error message
            notification("You can't go there!", "info")

            // Return to old position
            const oldPosition = getCheckerPos(
              currentChecker.col,
              currentChecker.row,
              currentChecker.removed
            )
            set({ position: oldPosition })

            return
          }

          let newPositions: number[] = null!

          // User is moving validly ..?
          if (action === "valid") {
            // Set the new position of the checker
            newPositions = getCheckerPos(to, numCheckers)

            // Saving the new position of the checker
            currentChecker.col = to
            currentChecker.row = numCheckers
            currentChecker.removed = false
          }

          // User is removing a checker
          if (action === "remove" && rmChecker) {
            // Set the new position of the checker
            newPositions = getCheckerPos(to, numCheckers - 1)
            // Saving the new position of the checker
            currentChecker.col = to
            currentChecker.row = numCheckers - 1
            currentChecker.removed = false

            // Cannot update the removed checker's position from here
            const removedLength = lenRemovedCheckers(
              checkers.current,
              rmChecker.color
            )

            checkers.current[rmChecker.id].col =
              rmChecker.color === "white" ? -1 : -2
            checkers.current[rmChecker.id].row = removedLength
            checkers.current[rmChecker.id].removed = true
          }

          updateStuff(newPositions, moved)

          // End of logic... phew!
          return
        }

        // User has moved off-grid OR back to their old position.
        // Either way they will return to their previous position
        const oldPosition = getCheckerPos(
          checkers.current[thisChecker.id].col,
          checkers.current[thisChecker.id].row,
          thisChecker.removed
        )
        set({ position: oldPosition })
      }
    },
    {
      // From position of the checker
      from: () => {
        const from = spring.position.get() as number[]
        return [from[0] * aspect, from[2] * aspect]
      },
      // For perfomance reasons
      eventOptions: { capture: false, passive: true },
    }
  )

  const updateStuff = (
    newPositions: number[],
    moved: number,
    rotation: number[] = [0, 0, 0]
  ) => {
    // Setting the checker's mesh position (not the physics)
    set({ position: newPositions, rotation })

    // Setting the checker's physics position
    checker.current.setTranslation({
      x: newPositions[0],
      y: newPositions[1],
      z: newPositions[2],
    })

    // Updating the dices
    dice.current.moves--
    if (dice.current.moves < 2) {
      if (dice.current.dice1 === moved) {
        dice.current.dice1 = 0
      } else {
        dice.current.dice2 = 0
      }
    }

    // Check if user has any valid moves
    const moves = hasMoves(checkers.current, dice.current, userChecker.current!)

    // If the user has no valid moves
    if (!moves) {
      // Switch players
      userChecker.current = switchPlayers(userChecker.current!)
      // Reset the dice moves
      dice.current.moves = 0
      dice.current.dice1 = 0
      dice.current.dice2 = 0
      // Show a message that the user has no valid moves
      notification("You don't have a move!", "error")
      // Set the phase to diceRoll
      if (!ws) {
        setPhase("diceRoll")
      } else {
        updateLiveGame()
      }
      return
    }

    // Updating the user that is playing, and the phase
    if (dice.current.moves === 0) {
      // Switch players
      userChecker.current = switchPlayers(userChecker.current!)
      // Set the phase to diceRoll
      if (!ws) {
        setPhase("diceRoll")
      }
    } else {
      // Making sure there's a rerender everytime the user moves
      // We have to make sure that user is not playing a live game
      // since in a live game, this exact same code gets run (check
      // useEffect with ws deppendency in Game)
      !ws &&
        setPhase((curr) => {
          return curr === "checkerMove" ? "checkerMoveAgain" : "checkerMove"
        })
    }

    // Updating the backend, if user is playing a live game
    ws && updateLiveGame()
  }

  // Sends a call to set the winner of the game
  const updateGameWinner = () => {
    if (!ws || !user) return
    ws.send(JSON.stringify({ finished: true, winner: user.user_id }))
  }

  // Updating the current game instance
  const updateLiveGame = () => {
    if (!ws) return
    ws.send(
      JSON.stringify({
        update: true,
        board: checkers.current,
        dice: dice.current,
        turn: userChecker.current,
      })
    )
  }

  return (
    <>
      {/* <a.instancedMesh
        {...bind()}
        {...spring}
        ref={instanceMesh}
        args={[
          nodes.WhiteChecker.geometry,
          color === "white"
            ? materials.WhiteCheckerMat
            : materials.DarkCheckerMat,
          15,
        ]}
        onPointerEnter={() => {
          // Change the cusror to grab
          document.body.style.cursor = "grab"
        }}
        onPointerLeave={() => {
          // Change the cusror to default
          document.body.style.cursor = "default"
        }}
      /> */}

      {/* The physics */}
      <RigidBody
        ref={checker}
        type="kinematicPosition"
        position={pos as Vector3}
      >
        <CuboidCollider args={[0.08, 0.02, 0.08]} />
      </RigidBody>

      {/* The mesh */}
      {/* @ts-ignore: SpringValue type is a Vector3, but TypeScript won't allow it */}
      <animated.mesh
        {...spring}
        {...bind()}
        name="WhiteChecker"
        geometry={nodes.WhiteChecker.geometry}
        material={
          thisChecker.color === "white"
            ? materials.WhiteCheckerMat
            : materials.DarkCheckerMat
        }
        onPointerEnter={() => {
          // Change the cusror to grab
          document.body.style.cursor = "grab"
        }}
        onPointerLeave={() => {
          // Change the cusror to default
          document.body.style.cursor = "default"
        }}
      />
    </>
  )
}

export default Checker
