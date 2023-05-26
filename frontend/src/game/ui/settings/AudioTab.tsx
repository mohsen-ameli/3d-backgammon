import { ChangeEvent, useState } from "react"
import { DEFAULT_SETTINGS, DEFAULT_SONG } from "../../data/Data"
import ReactSwitch from "react-switch"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { useGameStore } from "@/game/store/useGameStore"
import { Song } from "@/game/types/Song.type"
import { shallow } from "zustand/shallow"

/**
 * The audio section of settings
 */
export default function AudioTab() {
  const { settings, songs, selectedSongs } = useGameStore(
    state => ({
      settings: state.settings,
      songs: state.songs,
      selectedSongs: state.selectedSongs,
    }),
    shallow,
  )

  const [sound, setSound] = useState(settings.sound)
  const [music, setMusic] = useState(settings.music)

  function toggleSoundPlaying(checked: boolean) {
    setSound(checked)
    useGameStore.setState(curr => ({
      settings: { ...curr.settings, sound: checked },
    }))
  }

  function toggleMusicPlaying(checked: boolean) {
    setMusic(checked)
    useGameStore.setState(curr => ({
      settings: { ...curr.settings, music: checked },
    }))
  }

  function playSong(song: Song) {
    if (song.name === DEFAULT_SONG.name) {
      useGameStore.setState({ selectedSongs: [DEFAULT_SONG] })
      return
    }

    // Select every song except for the random song
    useGameStore.setState(curr => ({ selectedSongs: curr.selectedSongs?.filter(s => s !== DEFAULT_SONG) }))

    if (selectedSongs?.includes(song)) {
      // User is removing a song
      useGameStore.setState(curr => ({
        selectedSongs: curr.selectedSongs?.filter(s => s.name !== song.name),
      }))
    } else {
      // User is adding a song
      useGameStore.setState(curr => ({
        selectedSongs: curr.selectedSongs && [...curr.selectedSongs, song],
      }))
    }
  }

  return (
    <>
      <div className="flex items-center justify-between gap-x-8">
        <h1>Toggle sound</h1>
        {/* @ts-ignore */}
        <ReactSwitch
          onChange={toggleSoundPlaying}
          checked={sound}
          uncheckedIcon={false}
          onColor="#0e904b"
          onHandleColor="#76c89c"
        />
      </div>
      <div className="flex items-center justify-between gap-x-8">
        <h1>Toggle music</h1>
        {/* @ts-ignore */}
        <ReactSwitch
          onChange={toggleMusicPlaying}
          checked={music}
          uncheckedIcon={false}
          onColor="#0e904b"
          onHandleColor="#76c89c"
        />
      </div>

      {/* Music volume slider */}
      <div className="mb-2 flex flex-col items-center justify-between gap-y-2">
        <h1>Music volume</h1>
        <VolumeSlider music={music} />
      </div>

      {/* Showing all of the songs as options */}
      <div className="grid grid-cols-2 gap-2">
        {songs?.map(song => (
          <div
            className="group relative h-fit w-full cursor-pointer rounded-lg bg-gray-800 p-3 transition-colors duration-75 ease-in-out hover:bg-gray-700"
            key={song.name}
            onClick={() => playSong(song)}
          >
            <h1
              className={`text-center text-white transition-colors duration-75 ease-in-out group-hover:text-orange-500`}
            >
              {song.name}
              {selectedSongs?.includes(song) && (
                <FontAwesomeIcon icon={faCheck} className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500" />
              )}
            </h1>
          </div>
        ))}
      </div>
    </>
  )
}

function VolumeSlider({ music }: { music: boolean }) {
  const setVolume = useGameStore(state => state.setVolume)
  const volume = useGameStore(state => state.volume)

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setVolume?.(Number(e.target.value))
  }

  return (
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={volume}
      className="h-1 w-full select-none focus:cursor-grab active:cursor-grabbing"
      onChange={handleChange}
      disabled={!music}
    />
  )
}
