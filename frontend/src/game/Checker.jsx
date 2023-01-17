import { useContext, useRef, useState } from "react"
import { CuboidCollider, RigidBody } from "@react-three/rapier"
import { useThree } from "@react-three/fiber"
import { useDrag } from "@use-gesture/react"
import { useSpring, a } from "@react-spring/three"
import { GameState } from "./Game"
import * as data from "./data/Data"
import getCheckerPos from "./utils/GetCheckerPos"
import { OrbitState } from "./OrbitContext"

const Checker = ({ info }) => {
  const checker = useRef()

  const {
    checkerPicked,
    nodes,
    materials,
    newCheckerPosition,
    diceNums,
    state,
  } = useContext(GameState)

  const { orbitControlsEnabled, setOrbitControlsEnabled } =
    useContext(OrbitState)

  // Checkers
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width

  // local state for every checker
  const [pos] = useState(() => getCheckerPos(info.col, info.row))

  // Animations for dragging
  const [spring, set] = useSpring(() => ({
    position: pos,
    config: { mass: 1, friction: 36, tension: 800 },
  }))

  // When a checker is picked up (dragged)
  const bind = useDrag(
    ({ offset: [x, y], dragging }) => {
      if (state.current === "checkerMove" && diceNums.current.length !== 0) {
        // Used for dragging the checker in the x, y, z directions
        const checkerX = x / aspect
        const checkerY = 0.2
        const checkerZ = y / aspect

        // Started dragging the checker
        if (dragging) {
          // Disabling orbit controls
          orbitControlsEnabled && setOrbitControlsEnabled(false)

          // Setting the checker's mesh position (not the physics)
          set({ position: [checkerX, checkerY, checkerZ] })

          checkerPicked.current = true
        }
        // Finished dragging
        else {
          setOrbitControlsEnabled(true)

          const from = info.col
          const to = newCheckerPosition.current
          const moved = to - from

          // If the user has moved to a valid column
          if (
            !isNaN(moved) &&
            moved > 0 &&
            diceNums.current.filter((num) => num === moved).length === 1
          ) {
            console.log("moved: ", moved, "dice: ", diceNums.current)

            // *1: Get the column number
            // *2: Get the from and to, column numbers
            // *3: Check how many columns they have moved
            // *4: If the dice number matches with last step, then proceed
            // 4.5: if not, show error message
            // 5: Call a function that will get the number of checker
            // on that column and give out a set of coordinates for
            // the new checker to placed on.
            // 6: Set the spring, and physics position based on 5.

            checkerPicked.current = false

            // Setting the checker's mesh position (not the physics)
            set({ position: [checkerX, data.GROUND, checkerZ] })

            // Setting the checker's physics position
            checker.current.setTranslation({
              x: checkerX,
              y: data.GROUND + 0.01,
              z: checkerZ,
            })
          }
          // User has moved off-grid
          else {
            set({ position: pos })
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
          info.color === "white"
            ? materials.WhiteCheckerMat
            : materials.DarkCheckerMat
        }
      />
    </>
  )
}

export default Checker
