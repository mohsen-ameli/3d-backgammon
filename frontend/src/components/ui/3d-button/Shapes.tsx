/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: rogozhko (https://sketchfab.com/rogozhko)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/dices-ac93361d354144fcbc9ea13c6bf9e11b
title: Dices
No additional changes were made to this model.
*/

import { useGLTF } from "@react-three/drei"
import { PerspectiveCameraProps, useThree } from "@react-three/fiber"
import { MotionConfig } from "framer-motion"
import { motion } from "framer-motion-3d"
import { useLayoutEffect, useMemo, useRef } from "react"
import { mouseToLightRotation, spring, transition } from "./settings"
import { useSmoothTransform } from "./useSmoothTransform"
import { CameraTypes, ObjType, ShapesType } from "@/types/3d-button.types"
import { GLTFResult } from "@/game/types/GLTFResult.type"

export default function Shapes({ isHover, isPress, mouseX, mouseY, text }: ShapesType) {
  const lightRotateX = useSmoothTransform(mouseY, spring, mouseToLightRotation)
  const lightRotateY = useSmoothTransform(mouseX, spring, mouseToLightRotation)

  const { nodes, materials } = useGLTF("/models/dice_colored.glb") as unknown as GLTFResult

  // Shuffled meshes
  const meshes = useMemo(() => {
    const allMeshes = [
      { geo: nodes.dice_03_dice_00_0.geometry, mat: materials.dice_00 },
      { geo: nodes.dice_01_dice_01_0.geometry, mat: materials.dice_01 },
      { geo: nodes.dice_02_dice_02_0.geometry, mat: materials.dice_02 },
      { geo: nodes.dice_00_dice_03_0.geometry, mat: materials.dice_03 },
    ]

    // allMeshes.sort(() => Math.random() - 0.5)

    return allMeshes

    // eslint-disable-next-line
  }, [])

  return (
    // <Canvas shadows className="rounded-full" resize={{ scroll: false, offsetSize: true }}>
    <>
      <Camera mouseX={mouseX} mouseY={mouseY} />
      <MotionConfig transition={transition}>
        <motion.group
          // @ts-ignore
          center={[0, 0, 0]}
          rotation={[lightRotateX, lightRotateY, 0]}
        >
          <Lights />
        </motion.group>

        <motion.group
          initial={false}
          animate={isHover ? "hover" : "rest"}
          dispose={null}
          variants={{
            hover: { z: isPress ? -0.9 : 0 },
          }}
        >
          <Dice1 geometry={meshes[0].geo} material={meshes[0].mat} />
          <Dice2 geometry={meshes[1].geo} material={meshes[1].mat} />
          <Dice3 geometry={meshes[2].geo} material={meshes[2].mat} />
          <Dice4 geometry={meshes[3].geo} material={meshes[3].mat} />
        </motion.group>
      </MotionConfig>
    </>
  )
}

function Dice1({ geometry, material }: ObjType) {
  return (
    <motion.mesh position={[-0.5, -0.5, 0]} variants={{ hover: { z: 2.3 } }}>
      <mesh geometry={geometry} material={material} scale={0.2} />
    </motion.mesh>
  )
}

function Dice2({ geometry, material }: ObjType) {
  return (
    <motion.mesh
      position={[-0.8, 0.4, 0]}
      rotation={[-0.5, 0, -0.3]}
      variants={{
        hover: {
          z: 1.5,
          x: -1.5,
          rotateX: -0.2,
          rotateZ: 0.4,
        },
      }}
    >
      <mesh geometry={geometry} material={material} scale={0.2} />
    </motion.mesh>
  )
}

function Dice3({ geometry, material }: ObjType) {
  return (
    <motion.mesh
      position={[0.1, 0.4, 0]}
      rotation={[-0.5, 0.5, 0]}
      variants={{
        hover: {
          y: 0.5,
          z: 2.5,
          rotateY: -0.2,
        },
      }}
    >
      <mesh geometry={geometry} material={material} scale={0.125} />
    </motion.mesh>
  )
}

function Dice4({ geometry, material }: ObjType) {
  return (
    <motion.mesh
      position={[1.1, 0, 0]}
      rotation-z={0.5}
      variants={{
        hover: {
          x: 1.8,
          z: 0.8,
          y: 0.6,
          rotateZ: -0.5,
        },
      }}
    >
      <mesh geometry={geometry} material={material} scale={0.25} />
    </motion.mesh>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight color="#fbbd61" position={[-10, -10, -10]} intensity={0.2} />
      <directionalLight color="#fbbd61" position={[-10, 0, 15]} intensity={0.8} />
      <directionalLight color="#fbbd61" position={[-5, 20, 2]} intensity={0.5} />
      <directionalLight color="#5d2289" position={[15, 10, -2]} intensity={2} />
      <directionalLight color="#5d2289" position={[15, 10, 5]} intensity={1} />
      <directionalLight color="#a980c9" position={[5, -10, 5]} intensity={1} />
    </>
  )
}

// Adapted from https://github.com/pmndrs/drei/blob/master/src/core/PerspectiveCamera.tsx
function Camera({ mouseX, mouseY, ...props }: CameraTypes) {
  const cameraX = useSmoothTransform(mouseX, spring, (x: number) => x / 350)
  const cameraY = useSmoothTransform(mouseY, spring, (y: number) => (-1 * y) / 350)

  const set = useThree(({ set }) => set)
  const camera = useThree(({ camera }) => camera)
  const size = useThree(({ size }) => size)
  const scene = useThree(({ scene }) => scene)
  const cameraRef = useRef<PerspectiveCameraProps>(null)

  useLayoutEffect(() => {
    const { current: cam } = cameraRef
    if (cam) {
      cam.aspect = size.width / size.height
      cam.updateProjectionMatrix?.()
    }
  }, [size, props])

  useLayoutEffect(() => {
    if (cameraRef.current) {
      const oldCam = camera
      // @ts-ignore
      set(() => ({ camera: cameraRef.current }))
      return () => set(() => ({ camera: oldCam }))
    }
  }, [camera, cameraRef, set])

  useLayoutEffect(() => {
    return cameraX.on("change", () => camera.lookAt(scene.position))
  }, [camera, cameraX, scene.position])

  return <motion.perspectiveCamera ref={cameraRef} fov={90} position={[cameraX, cameraY, 3.8]} />
}
