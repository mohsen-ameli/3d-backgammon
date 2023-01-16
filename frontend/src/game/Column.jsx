import { useEffect, useRef } from "react"
import * as THREE from "three"
import { COLOUMN_HOVER_COLOR } from "./data/Data"

const Column = ({ obj, nodes, materials }) => {
  const materail = useRef(new THREE.MeshStandardMaterial())
  const blackOrWhite = useRef()

  useEffect(() => {
    if (getObjNum(obj.name) % 2 === 0) {
      blackOrWhite.current = "white"
      materail.current.copy(materials.ColumnWhite)
    } else {
      blackOrWhite.current = "black"
      materail.current.copy(materials.ColumnDark)
    }
  }, [])

  return (
    <mesh
      onPointerOver={() => materail.current.color.set(COLOUMN_HOVER_COLOR)}
      onPointerLeave={() =>
        materail.current.color.set(
          blackOrWhite.current === "white"
            ? materials.ColumnWhite.color
            : materials.ColumnDark.color
        )
      }
      position={obj.position}
      geometry={
        getObjNum(obj.name) <= 12
          ? nodes["col_1"].geometry
          : nodes["col_13"].geometry
      }
      material={materail.current}
    />
  )
}

const getObjNum = (name) => {
  return parseInt(name.split("_")[1])
}

export default Column
