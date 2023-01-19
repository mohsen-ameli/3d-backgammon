import { OrbitControls } from "@react-three/drei"
import { createContext, useContext, useState } from "react"
import Checker from "./Checker"
import { GameState } from "./Game"

export const OrbitState = createContext()

const OrbitProvider = () => {
  const { checkers } = useContext(GameState)

  const [orbitControlsEnabled, setOrbitControlsEnabled] = useState(true)

  return (
    <OrbitState.Provider
      value={{
        orbitControlsEnabled,
        setOrbitControlsEnabled,
      }}
    >
      <OrbitControls makeDefault enabled={orbitControlsEnabled} />
      {checkers.current.map((data) => (
        <Checker thisChecker={data} key={data.id} />
      ))}
    </OrbitState.Provider>
  )
}

export default OrbitProvider
