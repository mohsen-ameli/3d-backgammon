import { useState } from "react"
import ReactSwitch from "react-switch"
import Button from "../../../components/ui/Button"
import { SettingsProps } from "../../types/LocalSettings.type"
import { useGameStore } from "@/game/store/useGameStore"
import { shallow } from "zustand/shallow"

export default function Other({ setOpen }: SettingsProps) {
  const settings = useGameStore(state => state.settings, shallow)

  // Debug
  const [debug, setDebug] = useState(settings.debug)
  // Performance
  const [perf, setPerf] = useState(settings.perf)

  // Toggles debug stuff
  function toggleDebug(checked: boolean) {
    setDebug(checked)
    useGameStore.setState(curr => ({
      settings: { ...curr.settings, debug: checked },
    }))
  }

  // Toggle the performance monitor
  function togglePerf(checked: boolean) {
    setPerf(checked)
    useGameStore.setState(curr => ({
      settings: { ...curr.settings, perf: checked },
    }))
  }

  // Opens/closes fullscreen
  function openFullScreen() {
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
        {/* @ts-ignore */}
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
        {/* @ts-ignore */}
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
