import { BufferGeometry, Material, Mesh, MeshStandardMaterial } from "three"
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

// Taken from an external source. Paul from the Poimandres? Thanks anyways
// Used for the nodes and materials type, when calling useGLTF
export type NodeType = Record<
  string,
  Mesh<BufferGeometry, Material | Material[]>
>
export type MaterialType = Record<string, MeshStandardMaterial>

// Actual result
export type GLTFResult = GLTF & {
  nodes: Record<string, Mesh>
  materials: Record<string, MeshStandardMaterial>
}
