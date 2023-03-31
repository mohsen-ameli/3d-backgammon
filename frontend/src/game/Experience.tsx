import { Canvas } from "@react-three/fiber"
import { Suspense, useRef, useState } from "react"

import { Debug, Physics } from "@react-three/rapier"
import { useContext } from "react"

import { AnimatePresence } from "framer-motion"
import { Perf } from "r3f-perf"
import { Vector3 } from "three"
import useStatus from "../components/hooks/useStatus"
import Loader from "../components/ui/Loader"
import Controls from "./Controls"
import Stage from "./Stage"
import Board from "./board/Board"
import Columns from "./board/Columns"
import Checkers from "./checkers/Checkers"
import { GameContext } from "./context/GameContext"
import { ORIGINAL_CAMERA_POSITION } from "./data/Data"
import Dices from "./dice/Dices"
import useViewPort from "./utils/useViewPort"

const Experience = () => {
  // Getting the user status. (Game requests and game request rejections)
  useStatus()

  // const [zIndex, setZIndex] = useState(20)
  const [started, setStarted] = useState(false)

  // Loader
  // const Loader = useLoadingScreen(setZIndex)

  const toggleStarted = () => setStarted(curr => !curr)

  return (
    <>
      <Canvas
        camera={{
          position: [
            ORIGINAL_CAMERA_POSITION.x,
            ORIGINAL_CAMERA_POSITION.y,
            ORIGINAL_CAMERA_POSITION.z,
          ],
          fov: 45,
          near: 0.2,
          far: 20,
        }}
        shadows
      >
        <Suspense fallback={null}>
          <Game />
        </Suspense>
      </Canvas>
      <AnimatePresence mode="wait">
        {!started && <Loader toggleStarted={toggleStarted} />}
      </AnimatePresence>
    </>
  )
}

const Game = () => {
  const { inGame, settings } = useContext(GameContext)

  // View port
  useViewPort()

  const vec = useRef(new Vector3())

  // A little animation, so the user doesn't get bored
  // useFrame((state, delta) => {
  //   if (inGame) return

  //   const elapsedTime = state.clock.getElapsedTime()
  //   const camera = state.camera

  //   vec.current.x = Math.cos(-elapsedTime * 0.2 * 0.4) * 8
  //   vec.current.z = Math.sin(-elapsedTime * 0.2 * 0.4) * 8
  //   vec.current.y = Math.sin(elapsedTime * 0.5 * 0.4) * 4

  //   camera.position.lerp(vec.current, 0.01)
  //   camera.updateProjectionMatrix()
  // })

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
