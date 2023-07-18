import { ThreeEvent, useThree } from "@react-three/fiber"
import { useCallback, useLayoutEffect, useRef } from "react"
import { Color, Euler, InstancedMesh, Matrix4, Quaternion, Vector3 } from "three"
import { COLUMN_HOVER_COLOR, GROUND } from "../data/Data"
import ColumnSide from "./ColumnSide"
import { useGameStore } from "../store/useGameStore"
import getValidHover from "./getValidHover"

/**
 * The 24 columns on the board, where checkers get dropped in. This component
 * contains logic for changing the column checkers colour when user hovers over it.
 */
export default function Columns() {
  const nodes = useGameStore.getState().nodes
  const materials = useGameStore.getState().materials

  // Ref to the actual columns
  const columnsRef = useRef<InstancedMesh>(null!)
  // Ref to the invisible column overlays for a better dragging experience.
  const columnsHoverRef = useRef<InstancedMesh | null>(null)
  // The color that the column will be changed to when it's hovered
  const colorWhenHovered = useRef(new Color(COLUMN_HOVER_COLOR))

  const count = 24

  // Saving the default positions of the column overlays
  useLayoutEffect(() => {
    if (!columnsHoverRef.current || !nodes) return

    const quaternion = new Quaternion()
    const scale = new Vector3(1, 1, 1)

    for (let i = 0; i < count; i++) {
      const matrix = new Matrix4()
      const position = nodes[`col_${i + 1}`].position.clone()

      if (i >= 12) {
        const rotated = new Euler(0, Math.PI, 0)
        position!.z -= 0.325
        matrix.compose(position!, quaternion.setFromEuler(rotated), scale)
      } else {
        position!.z += 0.325
        matrix.compose(position!, quaternion, scale)
      }

      columnsHoverRef.current.setMatrixAt(i, matrix)
    }

    // Updating the instance matrix
    columnsHoverRef.current.instanceMatrix.needsUpdate = true
  }, [nodes])

  // Saving the default positions of the columns.
  useLayoutEffect(() => {
    if (!columnsRef.current || !nodes) return

    const quaternion = new Quaternion()
    const scale = new Vector3(1, 1, 1)

    for (let i = 0; i < count; i++) {
      const matrix = new Matrix4()
      const position = nodes[`col_${i + 1}`].position

      if (i >= 12) {
        const rotated = new Euler(0, Math.PI, 0)
        matrix.compose(position!, quaternion.setFromEuler(rotated), scale)
      } else {
        matrix.compose(position!, quaternion, scale)
      }

      columnsRef.current.setMatrixAt(i, matrix)
      columnsRef.current.setColorAt(i, i % 2 === 0 ? materials?.ColumnDark.color! : materials?.ColumnWhite.color!)
    }

    // Updating the instance matrix and color
    columnsRef.current.instanceColor!.needsUpdate = true
    columnsRef.current.instanceMatrix.needsUpdate = true
  }, [nodes])

  // When user hovers over one of the columns
  const handleHover = useCallback((e: ThreeEvent<PointerEvent>) => {
    const id = e.instanceId as number
    const valid = getValidHover(id)

    if (!valid || !columnsRef.current) {
      useGameStore.setState({ newCheckerPosition: undefined })
      return
    }

    // Setting the color of the hovered column to red
    columnsRef.current.setColorAt(id, colorWhenHovered.current)
    columnsRef.current.instanceColor!.needsUpdate = true

    // Saving the state
    useGameStore.setState({ newCheckerPosition: id })
  }, [])

  // User has released their pointer, on one of the columns
  const handleHoverFinished = useCallback((e: ThreeEvent<PointerEvent>) => {
    const id = e.instanceId as number
    const instance = columnsRef.current.instanceColor!

    // Resetting the color of the column, when user hovers off
    columnsRef.current.setColorAt(id, id % 2 === 0 ? materials?.ColumnDark.color! : materials?.ColumnWhite.color!)
    instance.needsUpdate = true

    if (useGameStore.getState().checkerPicked) return

    // Saving the state
    useGameStore.setState({ newCheckerPosition: undefined })
  }, [])

  if (!nodes) return <></>

  return (
    <group position-y={GROUND}>
      {/* Columns */}
      <instancedMesh ref={columnsRef} args={[nodes?.col_1.geometry, undefined, count]}>
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
      <ColumnSide node={nodes.WhiteHouse} />
      <ColumnSide node={nodes.BlackHouse} />
    </group>
  )
}
