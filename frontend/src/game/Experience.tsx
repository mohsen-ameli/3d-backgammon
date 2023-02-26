import { Canvas } from "@react-three/fiber"
import Game from "./Game"
import { Suspense } from "react"
import useLoadingScreen from "../components/hooks/useLoadingScreen"

const Experience = () => {
  // Loader
  const Loader = useLoadingScreen()

  return (
    <Canvas
      camera={{
        position: [0, 3.5, 0],
        fov: 45,
      }}
      shadows
    >
      <Suspense fallback={Loader}>
        <Game />
      </Suspense>
    </Canvas>
  )
}

export default Experience
