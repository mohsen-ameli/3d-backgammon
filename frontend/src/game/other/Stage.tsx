import { ContactShadows } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useEffect, useMemo, useRef, useState } from "react"
import { CubeTexture, CubeTextureLoader, DirectionalLight, LoadingManager, SRGBColorSpace } from "three"
import { useGameStore } from "../store/useGameStore"
import { DEFAULT_ENV_MAP_INTENSITY } from "../data/Data"
import { shallow } from "zustand/shallow"

const files = ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]

const manager = new LoadingManager()
const loader = new CubeTextureLoader(manager)

/**
 * Staging for our scene
 */
export default function Stage() {
  const materials = useGameStore.getState().materials
  const inGame = useGameStore(state => state.inGame)
  const settings = useGameStore(state => state.settings, shallow)

  const { scene } = useThree()

  const directionalLight = useRef<DirectionalLight>(null!)

  const [cubeEnvs, setCubeEnvs] = useState<CubeTexture[]>([])

  // Loads a background texture
  async function loadBackground(name: "brilliant_hall" | "diamond_hall" | "fin_garden") {
    // Checking if the background already is loaded
    if (cubeEnvs.filter(env => env.name === name).length === 1) return

    const texture = await loader.setPath(`/env/cube/${name}/`).loadAsync(files)
    texture.name = name

    setCubeEnvs(curr => [...curr, texture])

    scene.background = texture
    scene.environment = texture
    scene.background.colorSpace = SRGBColorSpace
    scene.environment.colorSpace = SRGBColorSpace
  }

  // Sets the background, based on the envMap state
  useMemo(async () => {
    if (!settings.envMap) return
    await loadBackground(settings.envMap)
  }, [settings.envMap])

  // Setting the environnement maps, and the default env map
  useEffect(() => {
    if (!materials) return
    materials.BoardWood2.envMapIntensity = DEFAULT_ENV_MAP_INTENSITY
    materials.ColumnDark.envMapIntensity = DEFAULT_ENV_MAP_INTENSITY
    materials.ColumnWhite.envMapIntensity = DEFAULT_ENV_MAP_INTENSITY
    materials.DarkCheckerMat.envMapIntensity = DEFAULT_ENV_MAP_INTENSITY
    materials.DiceDark.envMapIntensity = DEFAULT_ENV_MAP_INTENSITY
    materials.DiceWhite.envMapIntensity = DEFAULT_ENV_MAP_INTENSITY
    materials.Hinge.envMapIntensity = DEFAULT_ENV_MAP_INTENSITY
    materials.WhiteCheckerMat.envMapIntensity = DEFAULT_ENV_MAP_INTENSITY
  }, [materials])

  return (
    <>
      {/* Shadows */}
      {inGame && (
        <ContactShadows
          position={[0, -0.05, 0]}
          scale={5}
          resolution={1024}
          color={"#000000"}
          opacity={0.8}
          blur={1.1}
        />
      )}

      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight
        ref={directionalLight}
        castShadow
        position={[0, 5, 0]}
        intensity={0.5}
        shadow-mapSize={[512, 512]}
      />
    </>
  )
}

/**
 * Some controls
 */

// type Presets =
//   | "sunset"
//   | "dawn"
//   | "night"
//   | "warehouse"
//   | "forest"
//   | "apartment"
//   | "studio"
//   | "city"
//   | "park"
//   | "lobby"

// const [showHelper, setShowHelper] = useState(true)
// useHelper(showHelper && directionalLight, DirectionalLightHelper, 1)
// const [preset, setPreset] = useState<Presets>("forest")

// Environment maps
// const { envBlur } = useControls(
//   "Environment Maps",
//   {
//     // sunset: button(() => setPreset("sunset")),
//     // dawn: button(() => setPreset("dawn")),
//     // night: button(() => setPreset("night")),
//     // warehouse: button(() => setPreset("warehouse")),
//     // forest: button(() => setPreset("forest")),
//     // apartment: button(() => setPreset("apartment")),
//     // studio: button(() => setPreset("studio")),
//     // city: button(() => setPreset("city")),
//     // park: button(() => setPreset("park")),
//     // lobby: button(() => setPreset("lobby")),
//     envBlur: { value: 0.01, min: 0, max: 1, step: 0.0001 },
//     envMapIntensity: {
//       value: envMapIntensity,
//       min: 0,
//       max: 10,
//       onChange: (state) => setEnvMapIntensity(state),
//     },
//   },
//   { collapsed: true }
// )

// // Contact shadows
// const { color, opacity, blur } = useControls(
//   "Contact Shadows",
//   {
//     color: "#000000",
//     opacity: { value: 0.8, min: 0, max: 1 },
//     blur: { value: 1.1, min: 0, max: 2, step: 0.001 },
//     show: button(() => setContactShadows((curr) => !curr)),
//   },
//   { collapsed: true }
// )

// Directional Light
// const { x, y, z, intensity } = useControls(
//   "Directional Light",
//   {
//     x: { value: 0, min: -10, max: 10 },
//     y: { value: 5, min: -10, max: 10 },
//     z: { value: 0, min: -10, max: 10 },
//     intensity: { value: 0.5, min: 0, max: 10 },
//     showHelper: button(() => {
//       setShowHelper((curr) => !curr)
//     }),
//   },
//   { collapsed: true }
// )
