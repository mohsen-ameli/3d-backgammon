import { useContext, useState } from "react"
import ReactSwitch from "react-switch"
import { GameContext } from "../../context/GameContext"

const Audio = () => {
  const {
    settings,
    setSettings,
    songs,
    setVolume,
    selectedSongs,
    setSelectedSongs,
  } = useContext(GameContext)

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
        <h1>Toggle sound</h1>
        <ReactSwitch
          onChange={toggleSound}
          checked={sound}
          uncheckedIcon={false}
          onColor="#0e904b"
          onHandleColor="#76c89c"
        />
      </div>
      <div className="flex items-center justify-between gap-x-8">
        <h1>Toggle music</h1>
        <ReactSwitch
          onChange={toggleMusic}
          checked={music}
          uncheckedIcon={false}
          onColor="#0e904b"
          onHandleColor="#76c89c"
        />
      </div>

      {/* Music volume slider */}
      <div className="mb-2 flex flex-col items-center justify-between gap-y-2">
        <h1>Music volume</h1>
        <input
          type="range"
          min="0"
          max="1"
          defaultValue="0.25"
          step="0.01"
          className="h-1 w-full select-none focus:cursor-grab active:cursor-grabbing"
          onChange={e => setVolume(Number(e.target.value))}
          disabled={!music}
        />
      </div>

      {/* Showing all of the songs as options */}
      <div className="grid grid-cols-2 gap-2">
        {songs.map(song => (
          <div
            className="group relative h-fit w-full cursor-pointer rounded-lg bg-gray-800 p-3 transition-colors duration-75 ease-in-out hover:bg-gray-700"
            key={song.name}
            // prettier-ignore
            onClick={() => {
              if (song.name === "Random") {
                setSelectedSongs([songs[0]])
                return
              }
              setSelectedSongs(prev => prev.filter(s => s.name !== "Random"))
              
              if (selectedSongs.includes(song)) {
                setSelectedSongs(prev => prev.filter(s => s.name !== song.name))
              } else {
                setSelectedSongs(prev => [...prev, song])
              }
            }}
          >
            <h1
              className={`text-center text-white transition-colors duration-75 ease-in-out group-hover:text-orange-500`}
            >
              {song.name}
              {selectedSongs.includes(song) && (
                <i className="fa-solid fa-check absolute right-2 top-1/2 -translate-y-1/2 text-green-500"></i>
              )}
            </h1>
          </div>
        ))}
      </div>
    </>
  )
}

export default Audio
