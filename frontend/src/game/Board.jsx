import { CuboidCollider, RigidBody } from "@react-three/rapier"
import { useContext } from "react"
import { GameState } from "./Game"

const Board = () => {
  const { nodes, materials } = useContext(GameState)

  return (
    <>
      {/* Board Hinge */}
      <mesh geometry={nodes.Cube012_1.geometry} material={materials.Hinge} />

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
        <CuboidCollider args={[0.5, 0.1, 0.1]} position={[0, 0.6, 2]} />

        <mesh
          geometry={nodes.Cube012.geometry}
          material={materials.BoardWood2}
        />
      </RigidBody>
    </>
  )
}

export default Board
