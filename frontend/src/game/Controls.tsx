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
  const resetting = useRef(false)
  const originalEnabledValue = useRef(false)
  const toggleAfterAnimation = useRef(false)

  useEffect(() => {
    if (!orbitRef.current) return

    // Saving the default state of the orbit controls
    orbitRef.current.saveState()
  }, [])

  // Function to toggle orbit controls
  toggleControls.current = useCallback(
    (from: "layout" | "checkerDisable" | "checkerEnable") => {
      // If we are in the midst of a reset
      if (!orbitRef.current) return

      if (resetting.current) {
        toggleAfterAnimation.current = !toggleAfterAnimation.current
        return
      }

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
  resetOrbit.current = useCallback(async () => {
    if (!orbitRef.current) return

    const duration = 3
    const ease = "Expo.easeInOut"

    originalEnabledValue.current = orbitRef.current.enabled
    resetting.current = true
    orbitRef.current.enabled = false

    // Snapping back to original camera position
    gsap.to(orbitRef.current.object.position, {
      ...DEFAULT_CAMERA_POSITION,
      duration,
      ease,
    })

    gsap.to(orbitRef.current.object.quaternion, {
      ...DEFAULT_ORBIT_QUATERNION,
      duration,
      ease,
    })

    await gsap.to(orbitRef.current.target, {
      ...DEFAULT_ORBIT_TARGET,
      duration,
      ease,
    })

    resetting.current = false
    orbitRef.current!.enabled = true
    if (toggleAfterAnimation.current) {
      toggleControls.current("layout")
    } else {
      orbitRef.current!.enabled = originalEnabledValue.current
    }
    toggleAfterAnimation.current = false
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
