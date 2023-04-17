import { useState } from "react"
import Audio from "./Audio"
import Background from "./Background"
import { SettingsProps } from "./LocalSettings.type"
import Other from "./Other"

/**
 * The overview of the settings, with different tabs
 */
const Settings = ({ setOpen }: SettingsProps) => {
  // The current tab
  const [tab, setTab] = useState(
    localStorage.getItem("settingsOptions")
      ? JSON.parse(localStorage.getItem("settingsOptions")!)
      : { audio: true, background: false, other: false }
  )

  // Toggle to switch to a new tab
  const toggleTab = (tab: "audio" | "background" | "other") => {
    const newOptions = {
      audio: tab === "audio" ? true : false,
      background: tab === "background" ? true : false,
      other: tab === "other" ? true : false,
    }

    localStorage.setItem("settingsOptions", JSON.stringify(newOptions))

    setTab(newOptions)
  }

  return (
    <div className="relative flex min-h-[200px] w-[350px] flex-col gap-y-4 pt-12 lg:min-h-[300px]">
      <div className="absolute -top-4 -left-4 w-full">
        <ul className="flex items-center justify-around text-xl font-semibold">
          <li
            className={
              "cursor-pointer border-b-4 " +
              (tab.audio
                ? "animate-pulse border-emerald-600 text-emerald-200"
                : "border-transparent")
            }
            onClick={() => toggleTab("audio")}
          >
            Audio
          </li>
          <li
            className={
              "cursor-pointer border-b-4 " +
              (tab.background
                ? "animate-pulse border-emerald-600 text-emerald-200"
                : "border-transparent")
            }
            onClick={() => toggleTab("background")}
          >
            Background
          </li>
          <li
            className={
              "cursor-pointer border-b-4 " +
              (tab.other
                ? "animate-pulse border-emerald-600 text-emerald-200"
                : "border-transparent")
            }
            onClick={() => toggleTab("other")}
          >
            Other
          </li>
        </ul>
      </div>

      {tab.audio && <Audio />}
      {tab.background && <Background setOpen={setOpen} />}
      {tab.other && <Other setOpen={setOpen} />}
    </div>
  )
}

export default Settings
