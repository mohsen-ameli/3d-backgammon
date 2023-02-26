import { useFrame } from "@react-three/fiber"
import { CuboidCollider, RigidBody } from "@react-three/rapier"
import { useContext, useRef } from "react"
import { Group } from "three"
import { AuthContext } from "../context/AuthContext"
import { GameState } from "./Game"

const Board = () => {
  const { nodes, materials } = useContext(GameState)
  const { gameMode } = useContext(AuthContext)
  const board = useRef<Group>(null!)

  useFrame((clock, delta) => {
    const speed = delta / 15

    if (!gameMode.current) {
      board.current.rotation.x += speed
      board.current.rotation.y += speed
    } else {
      board.current.rotation.x = 0
      board.current.rotation.y = 0
    }
  })

  return (
    <group ref={board}>
      {/* Board Hinge */}
      <mesh geometry={nodes.Hinge.geometry} material={materials.Hinge} />

      <RigidBody type="fixed" colliders={false}>
        {/* Surface */}
        <CuboidCollider args={[1.175, 0.1, 0.935]} position={[0, -0.15, 0]} />

        {/* Center */}
        <CuboidCollider args={[0.07, 0.115, 1]} position={[0, 0, 0]} />

        {/* Left */}
        <CuboidCollider args={[0.07, 0.5, 1]} position={[-1.245, 0.06, 0]} />

        {/* Right */}
        <CuboidCollider args={[0.07, 0.5, 1]} position={[1.245, 0.06, 0]} />

        {/* Top */}
        <CuboidCollider args={[1.175, 0.5, 0.07]} position={[0, 0.06, -1]} />

        {/* Bottom */}
        <CuboidCollider args={[1.175, 0.5, 0.07]} position={[0, 0.06, 1]} />

        {/* Dice Holder */}
        <CuboidCollider args={[0.5, 0.1, 0.5]} position={[0, 0.6, 2]} />

        <mesh geometry={nodes.Board.geometry} material={materials.BoardWood2} />
      </RigidBody>
    </group>
  )
}

export default Board
