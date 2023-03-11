import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { ContactShadows } from "@react-three/drei"
import {
  CubeTexture,
  CubeTextureLoader,
  DirectionalLight,
  LoadingManager,
  sRGBEncoding,
} from "three"
import { DEFAULT_ENV_MAP_INTENSITY } from "./data/Data"
import { GameContext } from "./context/GameContext"
import { useThree } from "@react-three/fiber"
import { button, useControls } from "leva"

/**
 * Staging for our scene
 */
const Stage = () => {
  const { materials, inGame, settings, setSettings } = useContext(GameContext)

  const { scene } = useThree()

  const directionalLight = useRef<DirectionalLight>(null!)

  const [cubeEnvs, setCubeEnvs] = useState<CubeTexture[]>()

  // Loads all of the env maps, and sets the envMap state
  useMemo(() => {
    const files = ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]

    const manager = new LoadingManager()
    // manager.onProgress = (url, loaded, total) => console.log(loaded / total)
    // manager.onLoad = () => console.log("Finished")

    const loader = new CubeTextureLoader(manager)

    const briliantHall = loader.setPath("/env/cube/briliant_hall/").load(files)
    const diamondHall = loader.setPath("/env/cube/diamond_hall/").load(files)
    const finGarden = loader.setPath("/env/cube/fin_garden/").load(files)

    briliantHall.name = "briliantHall"
    diamondHall.name = "diamondHall"
    finGarden.name = "finGarden"

    const cubeTextures = [briliantHall, diamondHall, finGarden]

    setCubeEnvs(cubeTextures)
  }, [])

  // Sets the background, based on the envMap state
  useMemo(() => {
    if (!cubeEnvs) return

    const chosen = cubeEnvs.filter(map => map.name === settings.envMap)

    scene.background = chosen[0]
    scene.environment = chosen[0]
    scene.background.encoding = sRGBEncoding
    scene.environment.encoding = sRGBEncoding
  }, [settings.envMap, cubeEnvs])

  // Setting the environement maps, and the default env map
  useEffect(() => {
    materials.BoardWood2.envMapIntensity = DEFAULT_ENV_MAP_INTENSITY
    materials.ColumnDark.envMapIntensity = DEFAULT_ENV_MAP_INTENSITY
    materials.ColumnWhite.envMapIntensity = DEFAULT_ENV_MAP_INTENSITY
    materials.DarkCheckerMat.envMapIntensity = DEFAULT_ENV_MAP_INTENSITY
    materials.DiceDark.envMapIntensity = DEFAULT_ENV_MAP_INTENSITY
    materials.DiceWhite.envMapIntensity = DEFAULT_ENV_MAP_INTENSITY
    materials.Hinge.envMapIntensity = DEFAULT_ENV_MAP_INTENSITY
    materials.WhiteCheckerMat.envMapIntensity = DEFAULT_ENV_MAP_INTENSITY
  }, [])

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

export default Stage

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
