import { useContext, useState } from "react"
import ReactSwitch from "react-switch"
import { GameContext } from "../context/GameContext"

const Settings = () => {
  const { settings } = useContext(GameContext)

  const [sound, setSound] = useState(settings.current.sound)
  const handleChange = (checked: boolean) => {
    setSound(checked)
    settings.current.sound = checked
  }

  return (
    <div className="h-full w-full">
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
    </div>
  )
}

export default Settings
