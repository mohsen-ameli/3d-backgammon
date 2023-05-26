import Button from "../../../components/ui/Button"
import { EnvMapType } from "../../types/Settings.type"
import { SettingsProps } from "../../types/LocalSettings.type"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { useGameStore } from "@/game/store/useGameStore"
import { shallow } from "zustand/shallow"

/**
 * The background section of settings
 */
export default function Background({ setOpen }: SettingsProps) {
  const settings = useGameStore(state => state.settings, shallow)

  function setEnv(envMap: EnvMapType) {
    useGameStore.setState(curr => ({
      settings: { ...curr.settings, envMap },
    }))

    localStorage.setItem("settingsEnv", envMap)

    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-y-2">
      <Button onClick={() => setEnv("diamond_hall")}>
        Diamond Hall{" "}
        {settings.envMap === "diamond_hall" && (
          <FontAwesomeIcon icon={faCheck} className="fa-beat-fade absolute right-0 top-1 text-green-400" />
        )}
      </Button>
      <Button onClick={() => setEnv("brilliant_hall")}>
        Brilliant Hall{" "}
        {settings.envMap === "brilliant_hall" && (
          <FontAwesomeIcon icon={faCheck} className="fa-beat-fade absolute right-0 top-1 text-green-400" />
        )}
      </Button>
      <Button onClick={() => setEnv("fin_garden")}>
        Fin Garden{" "}
        {settings.envMap === "fin_garden" && (
          <FontAwesomeIcon icon={faCheck} className="fa-beat-fade absolute right-0 top-1 text-green-400" />
        )}
      </Button>
    </div>
  )
}
