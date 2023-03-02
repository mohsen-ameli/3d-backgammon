import { useContext } from "react"
import Checker from "./Checker"
import { GameState } from "../Game"

/**
 * Container for all of the checkers
 */
const Checkers = () => {
  const { checkers } = useContext(GameState)

  if (checkers.current)
    return (
      <>
        {checkers.current.map(data => (
          <Checker thisChecker={data} key={data.id} />
        ))}
      </>
    )

  return <></>
}

export default Checkers
