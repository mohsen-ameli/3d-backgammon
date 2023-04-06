import { useContext, useState } from "react"
import ReactSwitch from "react-switch"
import Button from "../../components/ui/Button"
import { GameContext } from "../context/GameContext"
import { EnvMapType } from "../types/Settings.type"

type settingsType = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Settings = ({ setOpen }: settingsType) => {
  const { settings, setSettings } = useContext(GameContext)

  // Sound
  const [sound, setSound] = useState(settings.sound)
  // Debug
  const [debug, setDebug] = useState(settings.debug)
  // Performance
  const [perf, setPerf] = useState(settings.perf)

  const toggleSound = (checked: boolean) => {
    setSound(checked)
    settings.sound = checked
  }

  const toggleDebug = (checked: boolean) => {
    setDebug(checked)
    setSettings(curr => {
      return {
        ...curr,
        debug: checked,
      }
    })
  }

  const togglePerf = (checked: boolean) => {
    setPerf(checked)
    setSettings(curr => {
      return {
        ...curr,
        perf: checked,
      }
    })
  }

  const setEnv = (envMap: EnvMapType) => {
    setSettings(curr => {
      return {
        ...curr,
        envMap,
      }
    })

    setOpen(false)
  }

  const openFullScreen = () => {
    const elem = document.querySelector("html")!
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      elem.requestFullscreen()
    }

    setOpen(false)
  }

  return (
    <div className="flex h-full w-full flex-col gap-y-4">
      <h1 className="mb-4 text-2xl font-semibold">Settings</h1>
      <div className="flex items-center justify-between gap-x-8">
        Toggle sound
        <ReactSwitch
          onChange={toggleSound}
          checked={sound}
          className="react-switch"
          checkedIcon={false}
          uncheckedIcon={false}
          onColor="#0e7490"
          onHandleColor="#22d3ee"
        />
      </div>

      <div className="flex items-center justify-between gap-x-8">
        Toggle debug
        <ReactSwitch
          onChange={toggleDebug}
          checked={debug}
          className="react-switch"
          checkedIcon={false}
          uncheckedIcon={false}
          onColor="#0e7490"
          onHandleColor="#22d3ee"
        />
      </div>

      <div className="flex items-center justify-between gap-x-8">
        Toggle performance monitor
        <ReactSwitch
          onChange={togglePerf}
          checked={perf}
          className="react-switch"
          checkedIcon={false}
          uncheckedIcon={false}
          onColor="#0e7490"
          onHandleColor="#22d3ee"
        />
      </div>

      <Button onClick={openFullScreen}>Toggle full-screen</Button>

      {/* prettier-ignore */}
      <div className="flex flex-col gap-y-2">
        <h1>Set background to:</h1>
        <Button onClick={() => setEnv("diamondHall")}>Diamond Hall {settings.envMap === "diamondHall" && <i className="absolute top-1 text-green-400 right-0 fa-solid fa-check fa-beat-fade"></i>}</Button>
        <Button onClick={() => setEnv("brilliantHall")}>Brilliant Hall {settings.envMap === "brilliantHall" && <i className="absolute top-1 text-green-400 right-0 fa-solid fa-check fa-beat-fade"></i>}</Button>
        <Button onClick={() => setEnv("finGarden")}>Fin Garden {settings.envMap === "finGarden" && <i className="absolute top-1 text-green-400 right-0 fa-solid fa-check fa-beat-fade"></i>}</Button>
      </div>
    </div>
  )
}

export default Settings
