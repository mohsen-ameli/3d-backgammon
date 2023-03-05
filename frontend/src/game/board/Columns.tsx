import { useContext, useLayoutEffect, useRef } from "react"
import ColumnSide from "./ColumnSide"
import { GameContext } from "../context/GameContext"
import {
  Quaternion,
  Vector3,
  Matrix4,
  Euler,
  Color,
  InstancedMesh,
  InstancedBufferAttribute,
  Group,
} from "three"
import { COLOUMN_HOVER_COLOR } from "../data/Data"
import { ThreeEvent, useFrame } from "@react-three/fiber"
import { GameWrapperContext } from "../context/GameWrapperContext"

/**
 * The 24 columns on the board, where checkers get dropped in. This component
 * contains logic for changing the column checkers colour when user hovers over it.
 */
const Columns = () => {
  const { nodes, materials, checkerPicked, newCheckerPosition } =
    useContext(GameContext)
  const { gameMode } = useContext(GameWrapperContext)

  const columns = useRef<Group>(null!)

  useFrame((clock, delta) => {
    const speed = delta / 12

    if (!gameMode.current) {
      columns.current.rotation.y += speed
    } else {
      columns.current.rotation.y = 0
    }
  })

  const columnsRef = useRef<InstancedMesh>(null!)

  const count = 24

  // Saving the default positions of the columns.
  useLayoutEffect(() => {
    const quaternion = new Quaternion()
    const scale = new Vector3(1, 1, 1)

    for (let i = 0; i < count; i++) {
      const matrix = new Matrix4()
      const position = nodes[`col_${i + 1}`].position

      if (i >= 12) {
        const rotated = new Euler(0, Math.PI, 0)
        matrix.compose(position, quaternion.setFromEuler(rotated), scale)
      } else {
        matrix.compose(position, quaternion, scale)
      }

      columnsRef.current.setMatrixAt(i, matrix)
      columnsRef.current.setColorAt(
        i,
        i % 2 === 0 ? materials.ColumnDark.color : materials.ColumnWhite.color
      )
    }

    // Updating the instance matrix and color
    columnsRef.current.instanceColor!.needsUpdate = true
    columnsRef.current.instanceMatrix.needsUpdate = true
  }, [])

  // When user hovers over one of the columns
  const handleHover = (e: ThreeEvent<PointerEvent>) => {
    // If they have a checker picked up
    if (checkerPicked.current) {
      const node = e.object as InstancedMesh
      const id = e.instanceId as number
      const color = new Color(COLOUMN_HOVER_COLOR)

      node.setColorAt(id, color)
      ;(node.instanceColor as InstancedBufferAttribute).needsUpdate = true
      newCheckerPosition.current = id
    }
  }

  // User has released their pointer, on one of the columns
  const handleHoverFinished = (e: ThreeEvent<PointerEvent>) => {
    const node = e.object as InstancedMesh
    const id = e.instanceId as number

    if (id! % 2 === 0) {
      node.setColorAt(id, materials.ColumnDark.color)
    } else {
      node.setColorAt(id, materials.ColumnWhite.color)
    }

    ;(node.instanceColor as InstancedBufferAttribute).needsUpdate = true
    newCheckerPosition.current = undefined
  }

  return (
    <group ref={columns} rotation-x={!gameMode.current ? -Math.PI / 6 : 0}>
      <instancedMesh
        onPointerOver={handleHover}
        onPointerLeave={handleHoverFinished}
        ref={columnsRef}
        args={[nodes["col_1"].geometry, undefined, count]}
      >
        <meshStandardMaterial name="Column" />
      </instancedMesh>

      <ColumnSide node={nodes["WhiteHouse"]} />
      <ColumnSide node={nodes["BlackHouse"]} />
    </group>
  )
}

export default Columns
