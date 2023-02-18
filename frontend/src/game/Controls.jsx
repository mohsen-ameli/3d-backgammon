import gsap from "gsap"
import { useControls } from "leva"
import { forwardRef, useContext, useEffect, useRef, useState } from "react"
import { GameState } from "./Game"
import { OrbitControls } from "@react-three/drei"
// import { useFrame } from "@react-three/fiber"
// import * as THREE from "three"
import {
  DEFAULT_ORBIT_POSITION,
  DEFAULT_ORBIT_QUATERNION,
  DEFAULT_ORBIT_TARGET,
} from "./data/Data"
// import {
//   damp,
//   damp2,
//   damp3,
//   damp4,
//   dampE,
//   dampM,
//   dampQ,
//   dampS,
//   dampC,
// } from "maath/easing"

const Controls = forwardRef(({}, orbitRef) => {
  const { resetOrbit, toggleControls } = useContext(GameState)

  const { dampingFactor, rotateSpeed } = useControls({
    dampingFactor: { value: 0.02, min: 0, max: 0.1, step: 0.001 },
    rotateSpeed: { value: 0.15, min: 0, max: 1, step: 0.001 },
  })

  // const [defaultCamera] = useState(() => new THREE.Vector3(0, 3.749999999998125, 0.000003749999999999375)) // prettier-ignore
  // const [defaultTarget] = useState(() => new THREE.Vector3(0, 0, 0))
  // const [defaultQuaternion] = useState(() => new THREE.Quaternion(-0.7071064276330685, 0, 0, 0.7071071347398497)) // prettier-ignore

  // const [lerping, setLerping] = useState(false)
  // const ref = useRef()

  useEffect(() => {
    // Setting the functions used in the game state
    resetOrbit.current = resetOrbit_
    toggleControls.current = toggleControls_

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

  // useFrame(({ camera }, delta) => {
  //   if (lerping) {
  //     const time = 0.5

  //     dampQ(camera.quaternion, defaultQuaternion, time, delta)
  //     damp3(camera.position, defaultCamera, time, delta)
  //     damp3(orbitRef.current.target, defaultTarget, time, delta)

  //     setTimeout(() => {
  //       setLerping(false)
  //       orbitRef.current.enabled = true
  //     }, 3000)
  //   }
  // })

  // const resetOrbit_ = () => {
  //   orbitRef.current.enabled = false
  //   setLerping(true)
  // }

  const resetOrbit_ = () => {
    const duration = 1

    orbitRef.current.enabled = false

    // Snapping back to original camera position
    gsap.to(orbitRef.current.object.position, {
      ...DEFAULT_ORBIT_POSITION,
      duration,
      ease: "power2.inOut",
    })

    gsap.to(orbitRef.current.object.quaternion, {
      ...DEFAULT_ORBIT_QUATERNION,
      duration,
      ease: "power2.inOut",
    })

    gsap.to(orbitRef.current.target, {
      ...DEFAULT_ORBIT_TARGET,
      duration,
      ease: "power2.inOut",
    })

    setTimeout(() => {
      orbitRef.current.enabled = true
    }, duration * 1000)
  }

  return (
    <>
      <OrbitControls
        ref={orbitRef}
        makeDefault
        minPolarAngle={-2}
        maxPolarAngle={Math.PI / 2}
        dampingFactor={dampingFactor}
        screenSpacePanning={true}
        zoomSpeed={0.5}
        rotateSpeed={rotateSpeed}
      />
    </>
  )
})

export default Controls
