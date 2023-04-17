import { memo, useContext } from "react"
import { GameContext } from "../context/GameContext"
import Checker from "./Checker"

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
        {/* <Testing /> */}
      </>
    )

  return <></>
}

export default memo(Checkers)
