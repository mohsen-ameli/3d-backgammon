import { MotionValue } from "framer-motion"
import { ButtonHTMLAttributes } from "react"
import { BufferGeometry, MeshStandardMaterial } from "three"

export type ShapesType = {
  isHover: boolean
  isPress: boolean
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}

export type CameraTypes = {
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}

export type ObjType = {
  geometry: BufferGeometry
  material: MeshStandardMaterial
}

export type Button3dProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string
}
