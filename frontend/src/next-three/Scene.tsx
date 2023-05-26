"use client"

import { Canvas } from "@react-three/fiber"
import { r3f } from "./global"
import { Props } from "@react-three/fiber/dist/declarations/src/web/Canvas"

export default function Scene({ children, ...props }: Props) {
  // Everything defined in here will persist between route changes, only children are swapped
  return (
    <Canvas {...props} eventPrefix="client" resize={{ scroll: false, offsetSize: true }} shadows>
      <r3f.Out />
    </Canvas>
  )
}
