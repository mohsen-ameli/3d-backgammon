import { useContext } from "react"
import Button from "../../../components/ui/Button"
import { GameContext } from "../../context/GameContext"
import { EnvMapType } from "../../types/Settings.type"
import { SettingsProps } from "./LocalSettings.type"

const Background = ({ setOpen }: SettingsProps) => {
  const { settings, setSettings } = useContext(GameContext)

  const setEnv = (envMap: EnvMapType) => {
    setSettings(curr => {
      return {
        ...curr,
        envMap,
      }
    })

    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-y-2">
      <Button onClick={() => setEnv("diamondHall")}>
        Diamond Hall{" "}
        {settings.envMap === "diamondHall" && (
          <i className="fa-solid fa-check fa-beat-fade absolute top-1 right-0 text-green-400"></i>
        )}
      </Button>
      <Button onClick={() => setEnv("brilliantHall")}>
        Brilliant Hall{" "}
        {settings.envMap === "brilliantHall" && (
          <i className="fa-solid fa-check fa-beat-fade absolute top-1 right-0 text-green-400"></i>
        )}
      </Button>
      <Button onClick={() => setEnv("finGarden")}>
        Fin Garden{" "}
        {settings.envMap === "finGarden" && (
          <i className="fa-solid fa-check fa-beat-fade absolute top-1 right-0 text-green-400"></i>
        )}
      </Button>
    </div>
  )
}

export default Background
