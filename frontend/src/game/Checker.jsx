import { useContext, useRef, useState } from "react"
import { CuboidCollider, RigidBody } from "@react-three/rapier"
import { useThree } from "@react-three/fiber"
import { useDrag } from "@use-gesture/react"
import { useSpring, a } from "@react-spring/three"
import { GameState } from "./Game"
import getCheckerPos from "./utils/GetCheckerPos"
import getCheckersOnCol from "./utils/GetCheckersOnCol"
import lenRemovedCheckers from "./utils/LenRemovedCheckers"
import switchPlayers from "./utils/switchPlayers"
import { useEffect } from "react"
import Endgame from "./utils/Endgame"
import GameWon from "./utils/GameWon"
import hasMoves from "./utils/HasMoves"

const Checker = ({ thisChecker }) => {
  const checker = useRef()

  const {
    checkerPicked,
    nodes,
    materials,
    newCheckerPosition,
    diceNums,
    checkers,
    userChecker,
    phase,
    setPhase,
    orbitControlsEnabled,
    setOrbitControlsEnabled,
  } = useContext(GameState)

  // Checkers
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width

  // local state for every checker
  const [pos, setPos] = useState([0, 0, 0])

  useEffect(() => {
    if (phase === "initial") {
      const newPos = getCheckerPos(
        thisChecker.col,
        thisChecker.row,
        thisChecker.removed
      )
      setPos(newPos)
      set({ position: newPos, rotation: [0, 0, 0] })
      // Setting the checker's physics position
      checker.current.setTranslation({
        x: newPos[0],
        y: newPos[1],
        z: newPos[2],
      })
    }
  }, [phase])

  // When a checker is removed, update its position
  useEffect(() => {
    const newPos = getCheckerPos(
      thisChecker.col,
      thisChecker.row,
      thisChecker.removed
    )
    setPos(newPos)
    set({ position: newPos })
  }, [thisChecker.removed])

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
    ({ event, offset: [x, y], dragging }) => {
      // For debugging purposes
      // console.log("checker", thisChecker)
      // console.log("dice", diceNums.current)
      // console.log("game won", GameWon(checkers.current, userChecker.current))
      // console.log("phase", phase)
      // console.log("thisChecker", thisChecker)

      // Check to see if the user is allowed to move
      if (
        phase === "checkerMove" &&
        diceNums.current.moves > 0 &&
        thisChecker.color === userChecker.current &&
        thisChecker.col !== -3 &&
        thisChecker.col !== -4
      ) {
        // User started dragging the checker
        if (dragging) {
          // If the user is dragging a checker from the removed column,
          // stop the other checkers from being dragged (if there are multiple
          // checkers in the removed column, they get stacked)
          let i = 0
          event.intersections.map((inter) => {
            if (inter.object.material.name.includes("Column")) {
              i++
            }
          })
          if (thisChecker.col < 0 && i === 0) event.stopPropagation()

          // Disabling orbit controls
          orbitControlsEnabled && setOrbitControlsEnabled(false)

          // Setting the checker's mesh position (not the physics)
          set({ position: [x / aspect, 0.2, y / aspect] })

          // The checker has been picked up
          checkerPicked.current = true
        }
        // Finished dragging (Main logic of the game)
        else {
          !orbitControlsEnabled && setOrbitControlsEnabled(true)
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
          const to = newCheckerPosition.current
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
                (diceNums.current.dice1 >= moved ||
                  diceNums.current.dice2 >= moved)
              ) {
                if (diceNums.current.dice1 > diceNums.current.dice2) {
                  moved = diceNums.current.dice1
                } else {
                  moved = diceNums.current.dice2
                }
                validMove = true
              }
              // The user has moved directly outside
              else if (
                diceNums.current.dice1 === moved ||
                diceNums.current.dice2 === moved
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
                const possibleWinner = userChecker.current

                updateStuff(positions, moved, [Math.PI / 3, 0, 0])

                const won = GameWon(checkers.current, possibleWinner)
                if (won) {
                  setPhase("ended")
                  userChecker.current = possibleWinner
                }

                return
              }
            }
          }

          // User is moving their checker withing the board
          if (
            // The user isn't going to the moon
            !isNaN(moved) &&
            // They are moving in the right direction (not backwards)
            moved > 0 &&
            // The user is moving by whatever the number on the dice is
            (diceNums.current.dice1 === moved ||
              diceNums.current.dice2 === moved) &&
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
              console.log("You can't go there!")

              // Return to old position
              const oldPosition = getCheckerPos(
                currentChecker.col,
                currentChecker.row,
                currentChecker.removed
              )
              set({ position: oldPosition })

              return
            }

            let newPositions

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
            if (action === "remove") {
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
      }
    },
    {
      // From position of the checker
      from: () => {
        return [
          spring.position.get()[0] * aspect,
          spring.position.get()[2] * aspect,
        ]
      },
      // For perfomance reasons
      eventOptions: {
        capture: false,
        passive: true,
      },
    }
  )

  function updateStuff(newPositions, moved, rotation = [0, 0, 0]) {
    // Setting the checker's mesh position (not the physics)
    set({ position: newPositions, rotation })

    // Setting the checker's physics position
    checker.current.setTranslation({
      x: newPositions[0],
      y: newPositions[1],
      z: newPositions[2],
    })

    // Updating the dices
    diceNums.current.moves--
    if (diceNums.current.moves < 2) {
      if (diceNums.current.dice1 === moved) {
        diceNums.current.dice1 = undefined
      } else {
        diceNums.current.dice2 = undefined
      }
    }

    // Updating the user that is playing, and the phase
    if (diceNums.current.moves === 0) {
      userChecker.current = switchPlayers(userChecker.current)
      setPhase("diceRoll")
    }

    // Checking if the user has any valid moves
    const hasMoves_ = hasMoves(
      checkers.current,
      diceNums.current,
      userChecker.current
    )
    console.log(hasMoves_)

    // If the user has no valid moves
    if (!hasMoves_) {
      // Switch players
      userChecker.current = switchPlayers(userChecker.current)
      // Reset the dice moves
      diceNums.current.moves = 0
      diceNums.current.dice1 = undefined
      diceNums.current.dice2 = undefined
      // Set the phase to diceRoll
      setPhase("diceRoll")
      // Show a message that the user has no valid moves
      return
    }
  }

  return (
    <>
      {/* The physics */}
      <RigidBody ref={checker} type="kinematicPosition" position={pos}>
        <CuboidCollider args={[0.08, 0.02, 0.08]} />
      </RigidBody>

      {/* The mesh */}
      <a.mesh
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
