import { OrbitControls } from "@react-three/drei"
import { createContext, useState } from "react"

export const OrbitState = createContext()

const OrbitProvider = (props) => {
  const [orbitControlsEnabled, setOrbitControlsEnabled] = useState(true)

  return (
    <OrbitState.Provider
      value={{
        orbitControlsEnabled,
        setOrbitControlsEnabled,
      }}
    >
      <OrbitControls makeDefault enabled={orbitControlsEnabled} />
      {props.children}
    </OrbitState.Provider>
  )
}

export default OrbitProvider
