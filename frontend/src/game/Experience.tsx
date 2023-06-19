"use client"

import { Canvas } from "@react-three/fiber"
import { Debug, Physics } from "@react-three/rapier"
import { Stats, useGLTF } from "@react-three/drei"
import { ORIGINAL_CAMERA_POSITION } from "@/game/data/Data"
import { useGameStore } from "./store/useGameStore"
import Controls from "./other/Controls"
import { useEffect } from "react"
import Board from "./board/Board"
import Columns from "./board/Columns"
import dynamic from "next/dynamic"
import useMusic from "./hooks/useMusic"
import Dice from "./dice/Dice"
import Checkers from "./checkers/Checkers"
import { shallow } from "zustand/shallow"
import { GLTFResult } from "./types/GLTFResult.type"
import useStatus from "@/game/hooks/useStatus"

const Stage = dynamic(() => import("./other/Stage"), { ssr: false })

// Device Pixel Ratio
const dpr = typeof window !== "undefined" ? Math.min(3, window.devicePixelRatio) : 2

// Preloading the models needed for the experience. Since the total number
// of items that needs to be loaded, changes, useProgress in Loader.tsx,
// will have trouble showing the right load %. So we hard code the numbers.
useGLTF.preload("/models/main.glb", true) // ITEMS_TO_LOAD = 13
useGLTF.preload("/models/dice_colored.glb") // ITEMS_TO_LOAD = 21
// useGLTF.preload("/models/rust_dice.glb") // ITEMS_TO_LOAD = 26

export default function Experience() {
  const inGame = useGameStore(state => state.inGame)
  const settings = useGameStore(state => state.settings, shallow)

  // Getting the user status. (Game requests and game request rejections)
  useStatus()

  // Getting the music goin'
  useMusic()

  // Saving the main model to the game store
  const { nodes, materials } = useGLTF("/models/main.glb", true) as unknown as GLTFResult
  useEffect(() => useGameStore.setState({ nodes, materials }), [])

  return (
    <Canvas
      camera={{
        position: [ORIGINAL_CAMERA_POSITION.x, ORIGINAL_CAMERA_POSITION.y, ORIGINAL_CAMERA_POSITION.z],
        fov: 45,
        near: 0.2,
        far: 20,
      }}
      shadows
      dpr={dpr}
    >
      {settings.perf && <Stats className="custom-stats" />}

      <Stage />
      <Controls />
      <Columns />

      {settings.debug && <gridHelper args={[100, 100]} />}

      <Physics>
        <Board />
        {settings.debug && <Debug />}
        {inGame && <Dice />}
        {inGame && <Checkers />}
      </Physics>
    </Canvas>
  )
}

/**
 * Animating the camera around the center
 */
// A little animation, so the user doesn't get bored
// const vec = useRef(new Vector3())
// useFrame((state, delta) => {
//   if (inGame) return
//   const elapsedTime = state.clock.getElapsedTime()
//   const camera = state.camera
//   vec.current.x = Math.cos(-elapsedTime * 0.2 * 0.4) * 8
//   vec.current.z = Math.sin(-elapsedTime * 0.2 * 0.4) * 8
//   vec.current.y = Math.sin(elapsedTime * 0.5 * 0.4) * 4
//   camera.position.lerp(vec.current, 0.01)
//   camera.updateProjectionMatrix()
// })
