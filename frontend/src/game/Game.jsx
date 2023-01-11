import { OrbitControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useContext, useRef } from "react"
import { AuthContext } from "../context/AuthContext"

const Game = () => {
  const { user } = useContext(AuthContext)
  const cube = useRef()

  useFrame((frame, delta) => {
    cube.current.rotation.x += delta * 0.2
    cube.current.rotation.y += delta * 0.2
  })

  return (
    <>
      <OrbitControls />

      <color args={["salmon"]} attach="background" />

      <mesh ref={cube}>
        <boxBufferGeometry />
        <meshStandardMaterial color="hotpink" />
      </mesh>

      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 5]} intensity={1} />
    </>
  )
}

export default Game
