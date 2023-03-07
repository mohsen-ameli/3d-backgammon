import { Canvas } from "@react-three/fiber"
import { Suspense, useState } from "react"
import useLoadingScreen from "../components/hooks/useLoadingScreen"
import { DEFAULT_CAMERA_POSITION } from "./data/Data"

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
        far: 10,
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
  const { inGame } = useContext(GameContext)

  // View port
  useViewPort()

  return (
    <>
      {/* Performance monitor */}
      {/* <Perf position="bottom-right" /> */}

      <Stage />

      <Controls />

      <Columns />

      <Physics>
        {/* <Debug /> */}

        <Board />

        {inGame && <Dices />}
        {inGame && <Checkers />}
      </Physics>
    </>
  )
}

export default Experience
