import { useCallback, useMemo, useRef } from "react"
import { MeshStandardMaterial } from "three"
import toCapitalize from "../../components/utils/ToCapitalize"
import { COLUMN_HOVER_COLOR } from "../data/Data"
import { UserCheckerType } from "../types/Checker.type"
import { NodeType } from "../types/GLTFResult.type"
import Endgame from "../utils/Endgame"
import { useGameStore } from "../store/useGameStore"
import ValidateMove from "../checkers/utils/ValidateMove"

/**
 * End columns for each user. This component is some what similar to the
 * Columns component.
 */
export default function ColumnSide({ node }: NodeType) {
  const materials = useGameStore.getState().materials

  const blackOrWhite = useRef<UserCheckerType>()

  // Setting the material for the column
  const material = useMemo(() => {
    const mat = new MeshStandardMaterial()
    mat.copy(materials?.BoardWood2!)

    blackOrWhite.current = node.name === "WhiteHouse" ? "white" : "black"

    return mat
  }, [])

  // User has hovered over the end column
  const handleHover = useCallback(() => {
    const checkerPicked = useGameStore.getState().checkerPicked
    const userChecker = useGameStore.getState().userChecker!

    if (!checkerPicked) return
    if (!node.name.includes(toCapitalize(userChecker))) return

    const end = Endgame(userChecker)
    if (!end) return

    const id = node.name === "WhiteHouse" ? -3 : -4
    let moved = 0

    if (id === -3) moved = 24 - checkerPicked.col
    else if (id === -4) moved = checkerPicked.col + 1

    const validHover = ValidateMove(checkerPicked, moved)
    if (!validHover) {
      useGameStore.setState({ newCheckerPosition: undefined })
      return
    }

    material.color.set(COLUMN_HOVER_COLOR)
    useGameStore.setState({ newCheckerPosition: id })
  }, [])

  // User has finished hovering over the end column
  const handleHoverFinished = useCallback(() => {
    material.color.set(materials!.BoardWood2.color)
    useGameStore.setState({ newCheckerPosition: undefined })
  }, [])

  return (
    <mesh
      onPointerOver={handleHover}
      onPointerLeave={handleHoverFinished}
      geometry={node.geometry}
      material={material}
    />
  )
}
