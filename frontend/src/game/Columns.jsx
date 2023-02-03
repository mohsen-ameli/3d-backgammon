import { useContext, useLayoutEffect, useRef } from "react"
import ColumnSide from "./ColumnSide"
import { GameState } from "./Game"
import * as THREE from "three"
import { COLOUMN_HOVER_COLOR } from "./data/Data"
import Column from "./Column"

const Columns = () => {
  const { nodes, materials, checkerPicked, newCheckerPosition } =
    useContext(GameState)

  const columnsRef = useRef()

  const count = 24

  useLayoutEffect(() => {
    const quaternion = new THREE.Quaternion()
    const scale = new THREE.Vector3(1, 1, 1)

    for (let i = 0; i < count; i++) {
      const matrix = new THREE.Matrix4()
      const position = nodes[`col_${i + 1}`].position

      if (i >= 12) {
        const rotated = new THREE.Euler(0, Math.PI, 0)
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
    columnsRef.current.instanceColor.needsUpdate = true
    columnsRef.current.instanceMatrix.needsUpdate = true
  }, [])

  const handleHover = (e) => {
    if (checkerPicked.current) {
      const node = e.object
      const id = e.instanceId
      const color = new THREE.Color(COLOUMN_HOVER_COLOR)

      node.setColorAt(id, color)
      node.instanceColor.needsUpdate = true
      newCheckerPosition.current = id
    }
  }

  const handleHoverFinished = (e) => {
    const node = e.object
    const id = e.instanceId

    if (id % 2 === 0) {
      node.setColorAt(id, materials.ColumnDark.color)
    } else {
      node.setColorAt(id, materials.ColumnWhite.color)
    }

    node.instanceColor.needsUpdate = true
    newCheckerPosition.current = undefined
  }

  return (
    <>
      {/* {Object.keys(nodes).map(
        (node, index) =>
          node.includes("col_") && <Column node={node} key={index} />
      )} */}

      <instancedMesh
        onPointerOver={handleHover}
        onPointerLeave={handleHoverFinished}
        ref={columnsRef}
        args={[nodes["col_1"].geometry, null, count]}
      >
        <meshStandardMaterial />
      </instancedMesh>

      <ColumnSide node={nodes["WhiteHouse"]} />
      <ColumnSide node={nodes["BlackHouse"]} />
    </>
  )
}

export default Columns
