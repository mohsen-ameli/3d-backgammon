import { useContext, useEffect, useRef, useState } from "react"
import { ContactShadows, Environment } from "@react-three/drei"
import { DirectionalLight } from "three"
// import bell_park_pier_2k from "../assets/env/hdr/bell_park_pier_2k.hdr"
import { GameState } from "./Game"
import { DEFAULT_ENV_MAP_INTENSITY } from "./data/Data"
import { AuthContext } from "../context/AuthContext"
import { useLocation } from "react-router-dom"
// import { button, useControls } from "leva"

/**
 * Staging for our scene
 */
const Stage = () => {
  const { gameMode } = useContext(AuthContext)
  const { materials } = useContext(GameState)

  const directionalLight = useRef<DirectionalLight>(null!)

  const location = useLocation()
  const [contactShadows, setContactShadows] = useState<boolean>(
    gameMode.current ? true : false
  )

  useEffect(() => {
    setContactShadows(gameMode.current ? true : false)
  }, [location])

  const [envMapIntensity, setEnvMapIntensity] = useState<number>(
    DEFAULT_ENV_MAP_INTENSITY
  )

  // Setting the environement maps
  useEffect(() => {
    materials.BoardWood2.envMapIntensity = envMapIntensity
    materials.ColumnDark.envMapIntensity = envMapIntensity
    materials.ColumnWhite.envMapIntensity = envMapIntensity
    materials.DarkCheckerMat.envMapIntensity = envMapIntensity
    materials.DiceDark.envMapIntensity = envMapIntensity
    materials.DiceWhite.envMapIntensity = envMapIntensity
    materials.Hinge.envMapIntensity = envMapIntensity
    materials.WhiteCheckerMat.envMapIntensity = envMapIntensity
  }, [envMapIntensity])

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

  // const [env, setEnv] = useState(0)
  // useControls("Environment Maps", {
  //   briliant_hall_0: button(() => setEnv(0)),
  //   briliant_hall_1: button(() => setEnv(1)),
  //   briliant_hall_3: button(() => setEnv(3)),
  // })

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

  return (
    <>
      {/* Performance monitor */}
      {/* <Perf position="top-left" /> */}

      {/* Shadows */}
      {contactShadows && (
        <ContactShadows
          position={[0, -0.05, 0]}
          scale={5}
          resolution={1024}
          color={"#000000"}
          opacity={0.8}
          blur={1.1}
        />
      )}

      {/* Diamond Hall */}
      <Environment
        background
        files={["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]}
        path="/env/cube/diamond_hall/0/"
      />

      {/* Briliant Hall */}
      {/* <Environment
        background
        files={["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]}
        path="/env/cube/briliant_hall/0/"
      /> */}

      {/* Fin Garden */}
      {/* <Environment
        background
        files={["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]}
        path="/env/cube/fin_garden/0/"
      /> */}

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
