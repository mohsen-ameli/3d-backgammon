import { useContext, useState } from "react"
import ReactSwitch from "react-switch"
import Button from "../../../components/ui/Button"
import { GameContext } from "../../context/GameContext"
import { SettingsProps } from "./LocalSettings.type"

const Other = ({ setOpen }: SettingsProps) => {
  const { settings, setSettings } = useContext(GameContext)

  // Debug
  const [debug, setDebug] = useState(settings.debug)
  // Performance
  const [perf, setPerf] = useState(settings.perf)

  // Toggles debug stuff
  const toggleDebug = (checked: boolean) => {
    setDebug(checked)
    setSettings(curr => {
      return {
        ...curr,
        debug: checked,
      }
    })
  }

  // Toggle the performance monitor
  const togglePerf = (checked: boolean) => {
    setPerf(checked)
    setSettings(curr => {
      return {
        ...curr,
        perf: checked,
      }
    })
  }

  // Opens/closes fullscreen
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
    <>
      <div className="flex items-center justify-between gap-x-8">
        Toggle debug
        <ReactSwitch
          onChange={toggleDebug}
          checked={debug}
          uncheckedIcon={false}
          onColor="#0e904b"
          onHandleColor="#76c89c"
        />
      </div>

      <div className="flex items-center justify-between gap-x-8">
        Toggle performance monitor
        <ReactSwitch
          onChange={togglePerf}
          checked={perf}
          uncheckedIcon={false}
          onColor="#0e904b"
          onHandleColor="#76c89c"
        />
      </div>

      <Button onClick={openFullScreen}>Toggle full-screen</Button>
    </>
  )
}

export default Other
