import gsap, { Power4 } from "gsap"
import { useContext, useEffect, useRef } from "react"
import { GameContext } from "./context/GameContext"
import { OrbitControls } from "@react-three/drei"
import {
  DEFAULT_ORBIT_POSITION,
  DEFAULT_ORBIT_QUATERNION,
  DEFAULT_ORBIT_TARGET,
} from "./data/Data"
import { OrbitControls as OrbitControlType } from "three-stdlib/controls/OrbitControls"

type OrbitType = {
  orbitEnabled: {
    enabled: boolean
    changable: boolean
  }
}

/**
 * Orbit controls. This component contains functions to reset the orbit controls
 * position to its original position, toggle the orcbit controls, and toggle
 * the zoom.
 */
const Controls = () => {
  const { resetOrbit, toggleControls, toggleZoom } = useContext(GameContext)

  const orbitRef = useRef<OrbitControlType & OrbitType>(null!)

  useEffect(() => {
    // Setting the functions used in the game state
    resetOrbit.current = resetOrbit_
    toggleControls.current = toggleControls_
    toggleZoom.current = toggleZoom_

    // Default enabled values
    orbitRef.current.orbitEnabled = {
      enabled: true,
      changable: true,
    }

    // Saving the default state of the orbit controls
    orbitRef.current.saveState()
  }, [])

  // Function to toggle orbit controls
  const toggleControls_ = (ui: boolean = false, drag: boolean = false) => {
    const changes = {
      enabled: !orbitRef.current.orbitEnabled.enabled,
    } as {
      enabled: boolean
      changable: boolean
    }

    // If we're changing the controls from the UI component
    if (ui) changes.changable = !orbitRef.current.orbitEnabled.changable
    // If we're changing the controls from the checker component
    else if (drag) {
      if (!orbitRef.current.orbitEnabled.enabled) return
      changes.changable = orbitRef.current.orbitEnabled.changable
    }

    // Just toggling the controls
    else if (orbitRef.current.orbitEnabled.changable)
      changes.changable = orbitRef.current.orbitEnabled.changable

    if (!changes) return

    orbitRef.current.orbitEnabled = changes
    orbitRef.current.enabled = changes["enabled"]
  }

  // Resets the orbit
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
      if (orbitRef.current.orbitEnabled.changable) {
        orbitRef.current.enabled = true
      }
    }, duration * 1000)
  }

  // Toggles zoom
  const toggleZoom_ = (newValue: boolean) => {
    orbitRef.current.enableZoom = newValue
  }

  return (
    <OrbitControls
      ref={orbitRef}
      makeDefault
      // minPolarAngle={-2}
      // maxPolarAngle={Math.PI / 2}
      dampingFactor={0.05}
      rotateSpeed={0.2}
      screenSpacePanning={true}
      zoomSpeed={0.5}
    />
  )
}

export default Controls
