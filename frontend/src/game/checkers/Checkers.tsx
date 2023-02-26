import { useContext } from "react"
import Checker from "./Checker"
import { GameState } from "../Game"

// ms = 0.5; calls = 35; geos = 22; instancedMesh = false; checkers = false; plugged = false
// ms = 0.2; calls = 36; geos = 23; instancedMesh = true; checkers = false; plugged = false
// ms = 1.6 -> 0.7; calls = 65; geos = 23; instancedMesh = false; checkers = true; plugged = false

/**
 * Container for all of the checkers
 */
const Checkers = () => {
  const { checkers } = useContext(GameState)

  // const allCheckers = useMemo(() => {
  //   const whitePositions = []
  //   const blackPositions = []
  //   const rotations = []
  //   const scales = []

  //   for (const checker of checkers.current) {
  //     const pos = getCheckerPos(checker.col, checker.row, checker.removed)

  //     if (checker.color === "white") {
  //       whitePositions.push([pos[0], pos[1], pos[2]])
  //     } else {
  //       blackPositions.push([pos[0], pos[1], pos[2]])
  //     }
  //     rotations.push([0, 0, 0])
  //     scales.push([1, 1, 1])
  //   }

  //   return { whitePositions, blackPositions, rotations, scales }
  // }, [])

  return (
    <>
      {checkers.current?.map((data) => (
        <Checker thisChecker={data} key={data.id} />
      ))}

      {/* <InstancedRigidBodies
        type="kinematicPosition"
        positions={allCheckers.whitePositions}
        rotations={allCheckers.rotations}
        scales={allCheckers.scales}
      >
        <Checker color="white" />
      </InstancedRigidBodies> */}

      {/* <InstancedRigidBodies
        type="kinematicPosition"
        positions={allCheckers.blackPositions}
        rotations={allCheckers.rotations}
        scales={allCheckers.scales}
      >
        <Checker color="black" />
      </InstancedRigidBodies> */}
    </>
  )
}

export default Checkers
