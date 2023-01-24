import { useContext } from "react"
import Checker from "./Checker"
import { GameState } from "./Game"

const Checkers = () => {
  const { checkers } = useContext(GameState)

  return (
    <>
      {checkers.current.map((data) => (
        <Checker thisChecker={data} key={data.id} />
      ))}
    </>
  )
}

export default Checkers
