import { useContext, useRef, useState } from "react"
import { CuboidCollider, RigidBody } from "@react-three/rapier"
import { useThree } from "@react-three/fiber"
import { useDrag } from "@use-gesture/react"
import { useSpring, a } from "@react-spring/three"
import { GameState } from "./Game"
import getCheckerPos from "./utils/GetCheckerPos"
import { OrbitState } from "./OrbitContext"
import getCheckersOnCol from "./utils/GetCheckersOnCol"
import lenRemovedCheckers from "./utils/LenRemovedCheckers"
import switchPlayers from "./utils/switchPlayers"
import { useEffect } from "react"

const Checker = ({ thisChecker }) => {
  const checker = useRef()

  const {
    checkerPicked,
    nodes,
    materials,
    newCheckerPosition,
    diceNums,
    checkers,
    userTurn,
    phase,
    setPhase,
  } = useContext(GameState)

  const { orbitControlsEnabled, setOrbitControlsEnabled } =
    useContext(OrbitState)

  // Checkers
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width

  // local state for every checker
  const [pos, setPos] = useState(() =>
    getCheckerPos(thisChecker.col, thisChecker.row, thisChecker.removed)
  )

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

  // Animations for dragging
  const [spring, set] = useSpring(() => ({
    position: pos,
    config: { mass: 1, friction: 37, tension: 800 },
  }))

  // When a checker is picked up (dragged)
  // This is where the main logic for the game is
  const bind = useDrag(
    ({ event, offset: [x, y], dragging }) => {
      // For debugging purposes
      // console.log("checker", checkerPicked.current)

      // Check to see if the user is allowed to move
      if (
        phase === "checkerMove" &&
        diceNums.current.length > 1 &&
        diceNums.current[2] > 0 &&
        thisChecker.color === userTurn.current
      ) {
        // User started dragging the checker
        if (dragging) {
          // If the user is dragging a checker from the removed column,
          // stop the other checkers from being dragged
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
        // Finished dragging
        else {
          setOrbitControlsEnabled(true)
          checkerPicked.current = false

          // Cannot update the removed checker's position from here
          const removedCheckersLen = lenRemovedCheckers(
            checkers.current,
            userTurn.current
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
          const moved = thisChecker.color === "white" ? to - from : from - to

          if (
            // The user isn't going to the moon
            !isNaN(moved) &&
            // They are moving in the right direction (not backwards)
            moved > 0 &&
            // The user is moving by whatever the number on the dice is
            (diceNums.current[0] === moved || diceNums.current[1] === moved) &&
            ((removedCheckersLen > 0 && thisChecker.removed) ||
              (removedCheckersLen === 0 && !thisChecker.removed))
          ) {
            // prettier-ignore
            const { action, numCheckers, rmChecker } = getCheckersOnCol(checkers.current, to, thisChecker)

            const currentChecker = checkers.current[thisChecker.id]

            if (action === "invalid") {
              // Show error message
              console.log("You can't go there!")
              const oldPosition = getCheckerPos(
                currentChecker.col,
                currentChecker.row,
                currentChecker.removed
              )
              set({ position: oldPosition })
              return
            }

            let newPositions

            if (action === "valid") {
              // Set the new position of the checker
              newPositions = getCheckerPos(to, numCheckers)

              // Saving the new position of the checker
              currentChecker.col = to
              currentChecker.row = numCheckers
              currentChecker.removed = false
            }

            if (action === "remove") {
              // Set the new position of the checker
              newPositions = getCheckerPos(to, numCheckers - 1)
              // Saving the new position of the checker
              currentChecker.col = to
              currentChecker.row = numCheckers - 1

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

            // Setting the checker's mesh position (not the physics)
            set({ position: newPositions })

            // Setting the checker's physics position
            checker.current.setTranslation({
              x: newPositions[0],
              y: newPositions[1],
              z: newPositions[2],
            })

            // Updating the dices
            diceNums.current[2]--
            if (diceNums.current[2] < 2) {
              if (diceNums.current[0] === moved) {
                diceNums.current[0] = undefined
              } else {
                diceNums.current[1] = undefined
              }
            }

            // Updating the user that is playing
            if (diceNums.current[2] === 0) {
              userTurn.current = switchPlayers(userTurn.current)
              setPhase("diceRoll")
            }

            // *1: Get the column number
            // *2: Get the from and to, column numbers
            // *3: Check how many columns they have moved
            // *4: If the dice number matches with last step, then proceed
            // 4.5: if not, show error message
            // 5: Call a function that will get the number of checkers
            // on that column. If the user is allowed to go to that column
            // then proceed, if not then show an error message or something.
            // -> There is a single dark checker -> Removing the checker
            // -> There are multiple dark checkers
            // -> There is/are white checkers
            // 6: Call another function to give out a set of coordinates for
            // the new checker to placed on.
            // 7: Set the spring, and physics position based on 5.
            // 8: Update the checkers positions. (checkers.current)

            return
          }

          // User has moved off-grid OR back to their old position. Either way they will return to their previous position
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
      eventOptions: {
        capture: false,
        passive: true,
      },
    }
  )

  return (
    <>
      <RigidBody ref={checker} type="kinematicPosition" position={pos}>
        <CuboidCollider args={[0.08, 0.02, 0.08]} />
      </RigidBody>
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
