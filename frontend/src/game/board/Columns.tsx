import { ThreeEvent } from "@react-three/fiber"
import { useContext, useLayoutEffect, useRef } from "react"
import {
  Color,
  Euler,
  InstancedMesh,
  Matrix4,
  Quaternion,
  Vector3,
} from "three"
import { GameContext } from "../context/GameContext"
import { COLUMN_HOVER_COLOR, GROUND } from "../data/Data"
import ColumnSide from "./ColumnSide"
import useGetValidHover from "./getValidHover"

/**
 * The 24 columns on the board, where checkers get dropped in. This component
 * contains logic for changing the column checkers colour when user hovers over it.
 */
const Columns = () => {
  const { nodes, materials, checkerPicked, newCheckerPosition } = useContext(GameContext) // prettier-ignore

  // Utility
  const { getValidHover } = useGetValidHover()

  // Ref to the actual columns
  const columnsRef = useRef<InstancedMesh | null>(null)
  // Ref to the invisible column overlays for a better dragging experience.
  const columnsHoverRef = useRef<InstancedMesh | null>(null)
  // The color that the column will be changed to when it's hovered
  const colorWhenHovered = useRef(new Color(COLUMN_HOVER_COLOR))

  const count = 24

  // Saving the default positions of the column overlays
  useLayoutEffect(() => {
    if (!columnsHoverRef.current) return

    const quaternion = new Quaternion()
    const scale = new Vector3(1, 1, 1)

    for (let i = 0; i < count; i++) {
      const matrix = new Matrix4()
      const position = nodes?.[`col_${i + 1}`].position.clone()

      if (i >= 12) {
        const rotated = new Euler(0, Math.PI, 0)
        position.z -= 0.325
        matrix.compose(position, quaternion.setFromEuler(rotated), scale)
      } else {
        position.z += 0.325
        matrix.compose(position, quaternion, scale)
      }

      columnsHoverRef.current.setMatrixAt(i, matrix)
    }

    // Updating the instance matrix
    columnsHoverRef.current.instanceMatrix.needsUpdate = true
  }, [])

  // Saving the default positions of the columns.
  useLayoutEffect(() => {
    if (!columnsRef.current) return

    const quaternion = new Quaternion()
    const scale = new Vector3(1, 1, 1)

    for (let i = 0; i < count; i++) {
      const matrix = new Matrix4()
      const position = nodes?.[`col_${i + 1}`].position

      if (i >= 12) {
        const rotated = new Euler(0, Math.PI, 0)
        matrix.compose(position, quaternion.setFromEuler(rotated), scale)
      } else {
        matrix.compose(position, quaternion, scale)
      }

      columnsRef.current.setMatrixAt(i, matrix)
      columnsRef.current.setColorAt(
        i,
        i % 2 === 0 ? materials?.ColumnDark.color : materials?.ColumnWhite.color
      )
    }

    // Updating the instance matrix and color
    columnsRef.current.instanceColor!.needsUpdate = true
    columnsRef.current.instanceMatrix.needsUpdate = true
  }, [])

  // When user hovers over one of the columns
  const handleHover = (e: ThreeEvent<PointerEvent>) => {
    if (!checkerPicked.current) return

    const id = e.instanceId as number
    const validHover = getValidHover(checkerPicked.current, id)
    if (!validHover || !columnsRef.current) {
      newCheckerPosition.current = undefined
      return
    }

    // Saving the state
    newCheckerPosition.current = id

    // Setting the color of the hovered column to red
    columnsRef.current.setColorAt(id, colorWhenHovered.current)
    columnsRef.current.instanceColor!.needsUpdate = true
  }

  // User has released their pointer, on one of the columns
  const handleHoverFinished = (e: ThreeEvent<PointerEvent>) => {
    const id = e.instanceId as number
    if (!columnsRef.current) return

    if (id! % 2 === 0) {
      columnsRef.current.setColorAt(id, materials?.ColumnDark.color)
    } else {
      columnsRef.current.setColorAt(id, materials?.ColumnWhite.color)
    }

    // Updating the node
    columnsRef.current.instanceColor!.needsUpdate = true

    // Saving the state
    if (checkerPicked.current) return
    newCheckerPosition.current = undefined
  }

  return (
    <group position-y={GROUND}>
      {/* Columns */}
      <instancedMesh
        ref={columnsRef}
        args={[nodes?.col_1.geometry, undefined, count]}
      >
        <meshStandardMaterial name="Column" />
      </instancedMesh>

      {/* Column overlays */}
      <instancedMesh
        onPointerOver={handleHover}
        onPointerLeave={handleHoverFinished}
        args={[undefined, undefined, count]}
        ref={columnsHoverRef}
        position-y={0.025}
      >
        <boxGeometry args={[0.2, 0.05, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </instancedMesh>

      {/* Side columns */}
      <ColumnSide node={nodes?.WhiteHouse} />
      <ColumnSide node={nodes?.BlackHouse} />
    </group>
  )
}

export default Columns
