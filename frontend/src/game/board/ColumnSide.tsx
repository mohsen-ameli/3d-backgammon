import { useContext, useRef } from "react"
import { COLOUMN_HOVER_COLOR } from "../data/Data"
import { MeshStandardMaterial } from "three"
import { GameContext } from "../context/GameContext"
import { useMemo } from "react"
import Endgame from "../utils/Endgame"
import toCapitalize from "../../components/utils/ToCapitalize"
import { UserCheckerType } from "../types/Game.type"
import { NodeType } from "../types/GLTFResult.type"

/**
 * End columns for each user. This component is some what simlar to the
 * Columns component.
 */
const ColumnSide = ({ node }: NodeType) => {
  const {
    materials,
    checkerPicked,
    newCheckerPosition,
    checkers,
    userChecker,
  } = useContext(GameContext)

  const blackOrWhite = useRef<UserCheckerType>()

  // Setting the material for the column
  const material = useMemo(() => {
    const mat = new MeshStandardMaterial()
    mat.copy(materials.BoardWood2)

    blackOrWhite.current = node.name === "WhiteHouse" ? "white" : "black"

    return mat
  }, [])

  // User has hovered over the end column
  const handleHover = () => {
    if (!checkerPicked.current) return
    if (!node.name.includes(toCapitalize(userChecker.current!))) return

    const end = Endgame(checkers.current, userChecker.current!)
    if (!end) return

    material.color.set(COLOUMN_HOVER_COLOR)
    newCheckerPosition.current = node.name === "WhiteHouse" ? -3 : -4
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
