import { useContext, useRef } from "react"
import { COLOUMN_HOVER_COLOR } from "./data/Data"
import { MeshStandardMaterial } from "three"
import { GameState } from "./Game"
import { useMemo } from "react"
import Endgame from "./utils/Endgame"
import toCapitalize from "../components/utils/ToCapitalize"
import { NodeType, UserCheckerType } from "./types/Game.type"

/**
 * End columns for each user.
 */
const ColumnSide = ({ node }: NodeType) => {
  const {
    materials,
    checkerPicked,
    newCheckerPosition,
    checkers,
    userChecker,
  } = useContext(GameState)

  const blackOrWhite = useRef<UserCheckerType>()

  const material = useMemo(() => {
    const mat = new MeshStandardMaterial()
    mat.copy(materials.BoardWood2)
    if (node.name === "WhiteHouse") {
      blackOrWhite.current = "white"
    } else {
      blackOrWhite.current = "black"
    }

    return mat
  }, [])

  // User has hovered over the end column
  const handleHover = () => {
    if (checkerPicked.current) {
      if (node.name.includes(toCapitalize(userChecker.current!))) {
        const end = Endgame(checkers.current, userChecker.current!)
        if (end) {
          material.color.set(COLOUMN_HOVER_COLOR)
          if (node.name === "WhiteHouse") {
            newCheckerPosition.current = -3
          } else {
            newCheckerPosition.current = -4
          }
        }
      }
    }
  }

  // User has finished hovering over the end column
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
