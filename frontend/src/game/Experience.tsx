import { Canvas, useFrame } from "@react-three/fiber"
import { Suspense, useEffect, useRef, useState } from "react"
import useLoadingScreen from "../components/hooks/useLoadingScreen"

import { useContext } from "react"
import { Debug, Physics } from "@react-three/rapier"

import Dices from "./dice/Dices"
import Board from "./board/Board"
import Columns from "./board/Columns"
import Checkers from "./checkers/Checkers"
import Controls from "./Controls"
import useViewPort from "./utils/useViewPort"
import Stage from "./Stage"
import { GameContext } from "./context/GameContext"
import useStatus from "../components/hooks/useStatus"
import { Perf } from "r3f-perf"
import { Vector3 } from "three"
import { DEFAULT_CAMERA_POSITION } from "./data/Data"

const Experience = () => {
  // Getting the user status. (Game requests and game request rejections)
  useStatus()

  const [zIndex, setZIndex] = useState(20)

  // Loader
  const Loader = useLoadingScreen(setZIndex)

  return (
    <Canvas
      camera={{
        position: [
          DEFAULT_CAMERA_POSITION.x,
          DEFAULT_CAMERA_POSITION.y,
          DEFAULT_CAMERA_POSITION.z,
        ],
        fov: 45,
        near: 0.2,
        far: 20,
      }}
      shadows
      style={{ zIndex: zIndex }}
    >
      <Suspense fallback={Loader}>
        <Game />
      </Suspense>
    </Canvas>
  )
}

const Game = () => {
  const { inGame, settings } = useContext(GameContext)

  // View port
  useViewPort()

  const vec = useRef(new Vector3())

  // A little animation, so the user doesn't get bored
  useFrame((state, delta) => {
    if (inGame) return

    const elapsedTime = state.clock.getElapsedTime()
    const camera = state.camera

    vec.current.x = Math.cos(-elapsedTime * 0.2 * 0.4) * 8
    vec.current.z = Math.sin(-elapsedTime * 0.2 * 0.4) * 8
    vec.current.y = Math.sin(elapsedTime * 0.5 * 0.4) * 4

    camera.position.lerp(vec.current, 0.01)
    camera.updateProjectionMatrix()
  })

  return (
    <>
      {settings.perf && <Perf position="bottom-right" />}

      <Stage />

      <Controls />

      <Columns />

      <Physics>
        {settings.debug && <Debug />}

        <Board />

        {inGame && <Dices />}
        {inGame && <Checkers />}
      </Physics>
    </>
  )
}

export default Experience
