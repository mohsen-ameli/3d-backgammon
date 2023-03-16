import { useContext, useState } from "react"
import ReactSwitch from "react-switch"
import Button from "../../components/ui/Button"
import { GameContext } from "../context/GameContext"
import { EnvMapType } from "../types/Game.type"

type settingsType = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Settings = ({ setOpen }: settingsType) => {
  const { settings, setSettings } = useContext(GameContext)

  const [sound, setSound] = useState(settings.sound)
  const handleChange = (checked: boolean) => {
    setSound(checked)
    settings.sound = checked
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
      <div className="flex items-center justify-between gap-x-32">
        Toggle sound
        <ReactSwitch
          onChange={handleChange}
          checked={sound}
          className="react-switch"
          checkedIcon={false}
          uncheckedIcon={false}
          onColor="#0e7490"
          onHandleColor="#22d3ee"
        />
      </div>

      <Button onClick={openFullScreen}>Toggle full-screen</Button>

      <div className="flex flex-col gap-y-2">
        <h1>Set Environment to:</h1>
        <Button onClick={() => setEnv("diamondHall")}>Diamond Hall</Button>
        <Button onClick={() => setEnv("briliantHall")}>Briliant Hall</Button>
        <Button onClick={() => setEnv("finGarden")}>Fin Garden</Button>
      </div>
    </div>
  )
}

export default Settings
