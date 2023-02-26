// import { GLTF } from "three/examples/jsm/loaders/GLTFLoader"
// import { Mesh, Group } from "three"
import { GLTF } from "three-stdlib"

// export type GLTFResult = GLTF & {
//   nodes: {
//     Chassis_1: THREE.Mesh
//     Chassis_2: THREE.Mesh
//   }
//   materials: {
//     BodyPaint: THREE.MeshStandardMaterial
//     BodyPaint_Accent: THREE.MeshStandardMaterial
//   }
// }

export type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>
  materials: Record<string, THREE.MeshStandardMaterial>
}
