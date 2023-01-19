import { OrbitControls } from "@react-three/drei"
import { useContext, useState } from "react"
import Checker from "./Checker"
import { GameState } from "./Game"

const Checkers = () => {
  const { checkers } = useContext(GameState)
  const [orbitControlsEnabled, setOrbitControlsEnabled] = useState(true)

  return (
    <>
      <OrbitControls makeDefault enabled={orbitControlsEnabled} />
      {checkers.current.map((data) => (
        <Checker
          thisChecker={data}
          key={data.id}
          orbitControlsEnabled={orbitControlsEnabled}
          setOrbitControlsEnabled={setOrbitControlsEnabled}
        />
      ))}
    </>
  )
}

export default Checkers
