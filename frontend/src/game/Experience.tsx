import { Canvas } from "@react-three/fiber"
import Game from "./Game"
import { Suspense, useEffect, useState } from "react"
import useLoadingScreen from "../components/hooks/useLoadingScreen"

const Experience = () => {
  const [zIndex, setZIndex] = useState(20)

  // Loader
  const Loader = useLoadingScreen(setZIndex)

  return (
    <Canvas
      camera={{
        position: [0, 3.5, 0],
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

export default Experience
