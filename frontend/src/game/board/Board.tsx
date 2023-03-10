import { CuboidCollider, RigidBody } from "@react-three/rapier"
import { useContext, useRef } from "react"
import { Mesh } from "three"
import { GameContext } from "../context/GameContext"

/**
 * Primary board mesh.
 */
const Board = () => {
  const { nodes, materials } = useContext(GameContext)

  const board = useRef<Mesh>(null!)
  const boardHinge = useRef<Mesh>(null!)

  return (
    <group>
      {/* Board Hinge */}
      <mesh
        ref={boardHinge}
        geometry={nodes.Hinge.geometry}
        material={materials.Hinge}
        receiveShadow
      />

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

        <mesh
          ref={board}
          geometry={nodes.Board.geometry}
          material={materials.BoardWood2}
          receiveShadow
        />
      </RigidBody>
    </group>
  )
}

export default Board
