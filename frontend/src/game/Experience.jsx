import { Canvas } from "@react-three/fiber"
import Game from "./Game"
import ViewPort from "./ViewPort"
import { Suspense } from "react"
import useLoadingScreen from "../components/hooks/useLoadingScreen"

const Experience = () => {
  // Loader
  const Loader = useLoadingScreen()

  const cameraArgs = {
    position: [0, 3.5, 0],
    fov: 45,
  }

  return (
    <Canvas camera={cameraArgs}>
      <Suspense fallback={Loader}>
        <Game />
        <ViewPort />
      </Suspense>
    </Canvas>
  )
}

export default Experience
