import Checker from "./Checker"
import { useGameStore } from "../store/useGameStore"

/**
 * Container for all of the checkers
 */
export default function Checkers() {
  // const checkers = useGameStore.getState().checkers
  const checkers = useGameStore(state => state.checkers)

  if (!checkers) return <></>

  return (
    <>
      {checkers.map(data => (
        <Checker thisChecker={data} key={data.id} />
      ))}
    </>
  )
}
