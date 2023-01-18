import { useContext, useRef, useState } from "react"
import { CuboidCollider, RigidBody } from "@react-three/rapier"
import { useThree } from "@react-three/fiber"
import { useDrag } from "@use-gesture/react"
import { useSpring, a } from "@react-spring/three"
import { GameState } from "./Game"
import * as data from "./data/Data"
import getCheckerPos from "./utils/GetCheckerPos"
import { OrbitState } from "./OrbitContext"
import getCheckersOnCol from "./utils/GetCheckersOnCol"
import removeChecker from "./utils/RemoveChecker"
import switchPlayers from "./utils/switchPlayers"

const Checker = ({ thisChecker }) => {
  const checker = useRef()

  const {
    checkerPicked,
    nodes,
    materials,
    newCheckerPosition,
    diceNums,
    state,
    checkers,
    userTurn,
  } = useContext(GameState)

  const { orbitControlsEnabled, setOrbitControlsEnabled } =
    useContext(OrbitState)

  // Checkers
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width

  // local state for every checker
  const [pos] = useState(() => getCheckerPos(thisChecker.col, thisChecker.row))

  // Animations for dragging
  const [spring, set] = useSpring(() => ({
    position: pos,
    config: { mass: 1, friction: 36, tension: 800 },
  }))

  // When a checker is picked up (dragged)
  const bind = useDrag(
    ({ offset: [x, y], dragging }) => {
      // Check to see if user is allowed to move
      if (
        state.current === "checkerMove" &&
        diceNums.current.length > 1 &&
        diceNums.current[2] > 0 &&
        thisChecker.color === userTurn.current
      ) {
        // User started dragging the checker
        if (dragging) {
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

          // From and to column number
          const from = thisChecker.col
          const to = newCheckerPosition.current
          const moved = thisChecker.color === "white" ? to - from : from - to

          if (
            // The user isn't going to the moon
            !isNaN(moved) &&
            // They are moving in the right direction (not backwards)
            moved > 0 &&
            // The user is moving by whatever the number on the dice is
            (diceNums.current[0] === moved || diceNums.current[1] === moved)
          ) {
            // console.log("from", from, "to", to, "moved", moved)

            // prettier-ignore
            const { action, numCheckers, rmChecker } = getCheckersOnCol( checkers.current, to, thisChecker)

            if (action === "invalid") {
              // Show error message
              console.log("You can't go there!")
              const oldPosition = getCheckerPos(
                checkers.current[thisChecker.id].col,
                checkers.current[thisChecker.id].row
              )
              set({ position: oldPosition })
              return
            }

            let newPositions

            if (action === "valid") {
              // Set the new position of the checker
              newPositions = getCheckerPos(to, numCheckers)

              // Saving the new position of the checker
              checkers.current[thisChecker.id].col = to
              checkers.current[thisChecker.id].row = numCheckers
            }

            if (action === "remove") {
              // Set the new position of the checker
              newPositions = getCheckerPos(to, numCheckers - 1)
              // Saving the new position of the checker
              checkers.current[thisChecker.id].col = to
              checkers.current[thisChecker.id].row = numCheckers - 1

              // Cannot update the removed checker's position from here

              // const newRemovedCheckerPos = removeChecker(
              //   checkers.current,
              //   rmChecker
              // )
              // // Setting the checker's mesh position (not the physics)
              // set({ position: newRemovedCheckerPos })

              // // Setting the checker's physics position
              // checker.current.setTranslation({
              //   x: newRemovedCheckerPos[0],
              //   y: newRemovedCheckerPos[1],
              //   z: newRemovedCheckerPos[2],
              // })
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
            if (diceNums.current[2] === 0)
              userTurn.current = switchPlayers(userTurn.current)

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
          }
          // User has moved off-grid OR back to their old position. Either way they will return to their previous position
          else {
            const oldPosition = getCheckerPos(
              checkers.current[thisChecker.id].col,
              checkers.current[thisChecker.id].row
            )
            set({ position: oldPosition })
          }
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
      />
    </>
  )
}

export default Checker
