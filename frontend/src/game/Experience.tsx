import { Canvas } from "@react-three/fiber"

import { Debug, Physics } from "@react-three/rapier"
import { useContext } from "react"

import { Stats } from "@react-three/drei"
import useStatus from "../components/hooks/useStatus"
import Board from "./board/Board"
import Columns from "./board/Columns"
import Checkers from "./checkers/Checkers"
import { GameContext } from "./context/GameContext"
import { ORIGINAL_CAMERA_POSITION } from "./data/Data"
import Dices from "./dice/Dices"
import Controls from "./other/Controls"
import Stage from "./other/Stage"
import { ExperienceProps } from "./types/Game.type"
import useMusic from "./utils/useMusic"

const Experience = ({ started }: ExperienceProps) => {
  // Getting the user status. (Game requests and game request rejections)
  useStatus()
  // Playing some fire songs
  useMusic(started)

  return (
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
      dpr={Math.min(3, window.devicePixelRatio)}
    >
      <Game />
    </Canvas>
  )
}

const Game = () => {
  const { inGame, settings } = useContext(GameContext)

  // A little animation, so the user doesn't get bored
  // const vec = useRef(new Vector3())
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
      {settings.perf && <Stats className="custom-stats" />}

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
