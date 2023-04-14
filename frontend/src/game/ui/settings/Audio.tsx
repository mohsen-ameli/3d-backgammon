import { useContext, useState } from "react"
import ReactSwitch from "react-switch"
import { GameContext } from "../../context/GameContext"

const Audio = () => {
  const { settings, setSettings } = useContext(GameContext)

  const [sound, setSound] = useState(settings.sound)
  const [music, setMusic] = useState(settings.music)

  const toggleSound = (checked: boolean) => {
    setSound(checked)
    setSettings(curr => {
      return {
        ...curr,
        sound: checked,
      }
    })
  }

  const toggleMusic = (checked: boolean) => {
    setMusic(checked)
    setSettings(curr => {
      return {
        ...curr,
        music: checked,
      }
    })
  }

  return (
    <>
      <div className="flex items-center justify-between gap-x-8">
        Toggle sound
        <ReactSwitch
          onChange={toggleSound}
          checked={sound}
          uncheckedIcon={false}
          onColor="#0e904b"
          onHandleColor="#76c89c"
        />
      </div>
      <div className="flex items-center justify-between gap-x-8">
        Toggle music
        <ReactSwitch
          onChange={toggleMusic}
          checked={music}
          uncheckedIcon={false}
          onColor="#0e904b"
          onHandleColor="#76c89c"
        />
      </div>
    </>
  )
}

export default Audio
