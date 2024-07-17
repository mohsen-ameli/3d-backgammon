import { useState } from "react"
import AudioTab from "./AudioTab"
import Background from "./Background"
import { SettingsProps } from "../../types/LocalSettings.type"
import Other from "./Other"

const tab_ = typeof window !== "undefined" && localStorage.getItem("settingsOptions")

/**
 * The settings modal, with different tabs to control things like
 * audio, background, debug, and others
 */
export default function Settings({ setOpen }: SettingsProps) {
  // The current tab
  const [tab, setTab] = useState(tab_ ? JSON.parse(tab_) : { audio: true, background: false, other: false })

  // Toggle to switch to a new tab
  function toggleTab(tab: "audio" | "background" | "other") {
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
      <div className="absolute -left-4 -top-4 w-full">
        <ul className="flex items-center justify-around text-xl font-semibold">
          <li
            className={
              "cursor-pointer border-b-4 " +
              (tab.audio ? "animate-pulse border-orange-900 text-orange-900" : "border-transparent transition hover:text-orange-600")
            }
            onClick={() => toggleTab("audio")}
          >
            Audio
          </li>
          <li
            className={
              "cursor-pointer border-b-4 " +
              (tab.background ? "animate-pulse border-orange-900 text-orange-900" : "border-transparent transition hover:text-orange-600")
            }
            onClick={() => toggleTab("background")}
          >
            Background
          </li>
          <li
            className={
              "cursor-pointer border-b-4 " +
              (tab.other ? "animate-pulse border-orange-900 text-orange-900" : "border-transparent transition hover:text-orange-600")
            }
            onClick={() => toggleTab("other")}
          >
            Other
          </li>
        </ul>
      </div>

      {tab.audio && <AudioTab />}
      {tab.background && <Background setOpen={setOpen} />}
      {tab.other && <Other setOpen={setOpen} />}
    </div>
  )
}
