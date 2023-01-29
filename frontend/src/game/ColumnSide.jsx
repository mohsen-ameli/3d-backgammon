import { useContext, useRef } from "react"
import { COLOUMN_HOVER_COLOR } from "./data/Data"
import * as THREE from "three"
import { GameState } from "./Game"
import { useMemo } from "react"
import Endgame from "./utils/Endgame"
import toCapitalize from "../components/utils/ToCapitalize"

const ColumnSide = ({ node }) => {
  const {
    materials,
    checkerPicked,
    newCheckerPosition,
    checkers,
    userChecker,
  } = useContext(GameState)

  const blackOrWhite = useRef()

  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial()
    mat.copy(materials.BoardWood2)
    if (node.name === "WhiteHouse") {
      blackOrWhite.current = "white"
    } else {
      blackOrWhite.current = "black"
    }

    return mat
  }, [])

  const handleHover = () => {
    if (node.name.includes(toCapitalize(userChecker.current))) {
      const end = Endgame(checkers.current, userChecker.current)
      if (checkerPicked.current && end) {
        material.color.set(COLOUMN_HOVER_COLOR)
        if (node.name === "WhiteHouse") {
          newCheckerPosition.current = -3
        } else {
          newCheckerPosition.current = -4
        }
      }
    }
  }

  const handleHoverFinished = () => {
    material.color.set(materials.BoardWood2.color)
    newCheckerPosition.current = undefined
  }

  return (
    <mesh
      onPointerOver={handleHover}
      onPointerLeave={handleHoverFinished}
      geometry={node.geometry}
      material={material}
    />
  )
}

export default ColumnSide
