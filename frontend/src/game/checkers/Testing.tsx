import { a as a3f, useSpring } from "@react-spring/three"
import { useThree } from "@react-three/fiber"
import { CuboidCollider, RigidBody, RigidBodyApi } from "@react-three/rapier"
import { useDrag } from "@use-gesture/react"
import { useContext, useRef, useState } from "react"
import { Vector3 } from "three"
import { GameContext } from "../context/GameContext"
import { GROUND_CHECKERS, TRAINING_DICE_MODE } from "../data/Data"

const Testing = () => {
  if (!TRAINING_DICE_MODE) return <></>

  const { nodes, materials, toggleControls } = useContext(GameContext)

  const checker = useRef<RigidBodyApi>(null)

  // Checkers
  const { viewport } = useThree()
  const { factor } = viewport

  const [pos, setPos] = useState<number[] | Vector3>([
    Math.random() * 0.5 - 0.5,
    0.5,
    0,
  ])

  const [spring, springApi] = useSpring(() => ({
    position: pos,
    config: { mass: 1, friction: 28, tension: 400 },
  }))

  const bind = useDrag(({ offset: [x, y], dragging, cancel }) => {
    if (dragging) {
      springApi.start({ position: [x / factor, 0, y / factor] })
      toggleControls.current("checkerDisable")
      return
    }
    toggleControls.current("checkerEnable")
    springApi.start({ position: [x / factor, GROUND_CHECKERS, y / factor] })

    checker.current?.setTranslation({
      x: x / factor,
      y: GROUND_CHECKERS,
      z: y / factor,
    })
  })

  return (
    <>
      <RigidBody
        ref={checker}
        type="kinematicPosition"
        position={pos as Vector3}
      >
        <CuboidCollider args={[0.08, 0.015, 0.08]} position={[0, 0.015, 0]} />
      </RigidBody>

      {/* @ts-ignore */}
      <a3f.mesh
        {...spring}
        {...bind()}
        name="WhiteChecker"
        castShadow
        geometry={nodes.WhiteChecker.geometry}
        material={materials.WhiteCheckerMat}
      />
    </>
  )
}

export default Testing
