import { useContext, useRef, useState } from "react"
import { CuboidCollider, RigidBody } from "@react-three/rapier"
import { useThree } from "@react-three/fiber"
import { useDrag } from "@use-gesture/react"
import { useSpring, a } from "@react-spring/three"
import { GameState } from "./Game"
import * as data from "./data/Data"
import getCheckerPos from "./utils/GetCheckerPos"

const Checker = ({ info }) => {
  const checker = useRef()

  const {
    orbitControlsEnabled,
    checkerPicked,
    nodes,
    materials,
    newCheckerPosition,
  } = useContext(GameState)

  // Checkers
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width

  // local state for every checker
  const [pos] = useState(() => getCheckerPos(info.col, info.row))

  // Animations for dragging
  const [spring, set] = useSpring(() => ({
    position: pos,
    config: { mass: 1, friction: 35, tension: 800 },
  }))

  // When a checker is picked up (dragged)
  const bind = useDrag(
    ({ offset: [x, y], dragging }) => {
      // Used for dragging the checker in the x, y, z directions
      const checkerX = x / aspect
      const checkerY = 0.2
      const checkerZ = y / aspect

      // Started dragging the checker
      if (dragging) {
        // Disabling orbit controls
        orbitControlsEnabled.current = orbitControlsEnabled.current && false

        // Setting the checker's mesh position (not the physics)
        set({ position: [checkerX, checkerY, checkerZ] })

        checkerPicked.current = true
      }
      // Finished dragging
      else {
        orbitControlsEnabled.current = true

        const from = info.col
        const to = newCheckerPosition.current
        console.log("from: ", from, "to: ", to, "moved: ", to - from)

        // *1: Get the column number
        // *2: Get the from and to, column numbers
        // *3: Check how many columns they have moved
        // 4: If the dice number matches with last step, then proceed
        // if not, then show error message
        // 5: Call a function that will get the number of checker
        // on that column and give out a set of coordinates for
        // the new checker to placed on.

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
