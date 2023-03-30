import { useContext } from "react"
import { GameContext } from "../context/GameContext"
import Checker from "./Checker"
import Testing from "./Testing"

/**
 * Container for all of the checkers
 */
const Checkers = () => {
  const { checkers } = useContext(GameContext)

  if (checkers.current)
    return (
      <>
        {checkers.current.map(data => (
          <Checker thisChecker={data} key={data.id} />
        ))}
        <Testing />
      </>
    )

  return <></>
}

export default Checkers
