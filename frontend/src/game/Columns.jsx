import { useContext } from "react"
import Column from "./Column"
import { GameState } from "./Game"

const Columns = () => {
  const { nodes } = useContext(GameState)

  return (
    <>
      {Object.keys(nodes).map(
        (node, index) =>
          node.includes("col_") && <Column node={node} key={index} />
      )}
    </>
  )
}

export default Columns
