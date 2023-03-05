import { Canvas } from "@react-three/fiber"
import { Suspense, useState } from "react"
import useLoadingScreen from "../components/hooks/useLoadingScreen"
import GameContextProvider from "./context/GameContext"
import { DEFAULT_CAMERA_POSITION } from "./data/Data"

const Experience = () => {
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
        <GameContextProvider />
      </Suspense>
    </Canvas>
  )
}

export default Experience
