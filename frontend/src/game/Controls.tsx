import gsap, { Power4 } from "gsap"
import { useCallback, useContext, useEffect, useRef } from "react"
import { OrbitControls } from "@react-three/drei"
import {
  DEFAULT_CAMERA_POSITION,
  DEFAULT_ORBIT_QUATERNION,
  DEFAULT_ORBIT_TARGET,
} from "./data/Data"
import { OrbitControls as OrbitControlType } from "three-stdlib/controls/OrbitControls"
import { GameContext } from "./context/GameContext"

type OrbitType = {
  locked: boolean
}

/**
 * Orbit controls. This component contains functions to reset the orbit controls
 * position to its original position, toggle the orcbit controls, and toggle
 * the zoom.
 */
const Controls = () => {
  const { resetOrbit, toggleControls } = useContext(GameContext)

  const orbitRef = useRef<OrbitControlType & OrbitType>(null)

  useEffect(() => {
    if (!orbitRef.current) return

    // Default enabled values
    // orbitRef.current.orbitEnabled = {
    //   enabled: true,
    //   changable: true,
    // }

    // Saving the default state of the orbit controls
    orbitRef.current.saveState()
  }, [])

  // Function to toggle orbit controls
  toggleControls.current = useCallback(
    (from: "layout" | "checkerDisable" | "checkerEnable") => {
      if (!orbitRef.current) return

      // If the controls are being toggled from the Layout component, then toggle it and set lock to the same value
      // (lock is used in checkerEnable, to make sure when user releases a checker, and if the controls are locked
      // we don't accidentally turn the controls back on.)
      if (from === "layout") {
        orbitRef.current.enabled = !orbitRef.current.enabled
        orbitRef.current.locked = !orbitRef.current.enabled
        return
      }

      // If the controls are being toggled from Checkers, and they want it to be disabled
      if (from === "checkerDisable") {
        if (orbitRef.current.enabled) {
          orbitRef.current.enabled = false
        }
      } else if (from === "checkerEnable") {
        // Enable the controls back if and only if it's not locked
        if (!orbitRef.current.enabled && !orbitRef.current.locked) {
          orbitRef.current.enabled = true
        }
      }
      return
    },
    []
  )

  // Resets the orbit controls position and rotation
  resetOrbit.current = useCallback(() => {
    if (!orbitRef.current) return

    const duration = 2

    const originalEnabledValue = orbitRef.current.enabled
    orbitRef.current.enabled = false

    // Snapping back to original camera position
    gsap.to(orbitRef.current.object.position, {
      ...DEFAULT_CAMERA_POSITION,
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
      if (!orbitRef.current) return
      orbitRef.current.enabled = originalEnabledValue
    }, duration * 1000 + 1000)
  }, [])

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
