import { useContext, useEffect, useRef } from "react"
import * as THREE from "three"
import { COLOUMN_HOVER_COLOR } from "./data/Data"
import { GameState } from "./Game"
import getObjNum from "./utils/GetObjNum"

const Column = ({ node }) => {
  const { nodes, materials, checkerPicked, newCheckerPosition } =
    useContext(GameState)

  const materail = useRef(new THREE.MeshStandardMaterial())
  const blackOrWhite = useRef()

  useEffect(() => {
    if (getObjNum(nodes[node].name) % 2 === 0) {
      blackOrWhite.current = "white"
      materail.current.copy(materials.ColumnWhite)
    } else {
      blackOrWhite.current = "black"
      materail.current.copy(materials.ColumnDark)
    }
  }, [])

  const handleHover = () => {
    if (checkerPicked.current) {
      materail.current.color.set(COLOUMN_HOVER_COLOR)
      newCheckerPosition.current = getObjNum(nodes[node].name) - 1
    }
  }

  const handleHoverFinished = () => {
    materail.current.color.set(
      blackOrWhite.current === "white"
        ? materials.ColumnWhite.color
        : materials.ColumnDark.color
    )
    newCheckerPosition.current = undefined
  }

  return (
    <mesh
      onPointerOver={handleHover}
      onPointerLeave={handleHoverFinished}
      position={nodes[node].position}
      geometry={
        getObjNum(nodes[node].name) <= 12
          ? nodes["col_1"].geometry
          : nodes["col_13"].geometry
      }
      material={materail.current}
    />
  )
}

export default Column
