import gsap, { Power4 } from "gsap"
import { forwardRef, useContext, useEffect } from "react"
import { GameState } from "./Game"
import { OrbitControls } from "@react-three/drei"
import {
  DEFAULT_ORBIT_POSITION,
  DEFAULT_ORBIT_QUATERNION,
  DEFAULT_ORBIT_TARGET,
} from "./data/Data"

const Controls = forwardRef(({}, orbitRef) => {
  const { resetOrbit, toggleControls, toggleZoom } = useContext(GameState)

  useEffect(() => {
    // Setting the functions used in the game state
    resetOrbit.current = resetOrbit_
    toggleControls.current = toggleControls_
    toggleZoom.current = toggleZoom_

    // Default enabled values
    orbitRef["orbitEnabled"] = {
      enabled: true,
      changable: true,
    }

    // Saving the default state of the orbit controls
    orbitRef.current.saveState()
  }, [])

  // Function to toggle orbit controls
  const toggleControls_ = (ui = false, drag = false) => {
    let changes

    // If we're changing the controls from the UI component
    if (ui) {
      changes = {
        enabled: !orbitRef.orbitEnabled["enabled"],
        changable: !orbitRef.orbitEnabled["changable"],
      }
    }
    // If we're changing the controls from the checker component
    else if (drag) {
      if (!orbitRef.orbitEnabled["enabled"]) return
      changes = {
        enabled: !orbitRef.orbitEnabled["enabled"],
        changable: orbitRef.orbitEnabled["changable"],
      }
    }
    // Just toggling the controls
    else if (orbitRef.orbitEnabled["changable"]) {
      changes = {
        enabled: !orbitRef.orbitEnabled["enabled"],
        changable: orbitRef.orbitEnabled["changable"],
      }
    }

    if (!changes) return

    orbitRef["orbitEnabled"] = changes
    orbitRef.current.enabled = changes["enabled"]
  }

  const resetOrbit_ = () => {
    const duration = 1

    orbitRef.current.enabled = false

    // Snapping back to original camera position
    gsap.to(orbitRef.current.object.position, {
      ...DEFAULT_ORBIT_POSITION,
      duration,
      ease: Power4.easeInOut,
    })

    gsap.to(orbitRef.current.object.quaternion, {
      ...DEFAULT_ORBIT_QUATERNION,
      duration,
      ease: Power4.easeInOut,
    })

    gsap.to(orbitRef.current.target, {
      ...DEFAULT_ORBIT_TARGET,
      duration,
      ease: Power4.easeInOut,
    })

    setTimeout(() => {
      if (orbitRef.orbitEnabled["changable"]) {
        orbitRef.current.enabled = true
      }
    }, duration * 1000)
  }

  const toggleZoom_ = () => {
    orbitRef.current.enableZoom = !orbitRef.current.enableZoom
  }

  return (
    <OrbitControls
      ref={orbitRef}
      makeDefault
      minPolarAngle={-2}
      maxPolarAngle={Math.PI / 2}
      dampingFactor={0.05}
      rotateSpeed={0.2}
      screenSpacePanning={true}
      zoomSpeed={0.5}
    />
  )
})

export default Controls
