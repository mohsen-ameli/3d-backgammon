import { useEffect, useMemo, useRef, useState } from "react"
import { DEFAULT_SETTINGS } from "../data/Data"
import { SettingsType } from "../types/Settings.type"
import { SongType } from "../types/Song.type"

/**
 * Hook that handles song playing
 */
const useMusic = (started: boolean, settings: SettingsType) => {
  // All songs
  const songs = useMemo(
    () => [
      {
        name: "Random",
        song: new Audio(),
      },
      {
        name: "Mild Piano",
        song: new Audio("/sounds/music/cinematic-documentary-piano.mp3"),
      },
      {
        name: "Cozy Evening",
        song: new Audio("/sounds/music/cozy-evening.mp3"),
      },
      {
        name: "Future Beats",
        song: new Audio("/sounds/music/electronic-future-beats.mp3"),
      },
      {
        name: "Pop Fashion",
        song: new Audio(
          "/sounds/music/energetic-upbeat-stylish-pop-fashion.mp3"
        ),
      },
      {
        name: "Hip Hop",
        song: new Audio(
          "/sounds/music/hip-hop-energetic-vlog-background-music.mp3"
        ),
      },
      {
        name: "Wild Piano",
        song: new Audio("/sounds/music/inspirational-piano.mp3"),
      },
      {
        name: "Infinity",
        song: new Audio("/sounds/music/password-infinity.mp3"),
      },
      {
        name: "Retro Funk",
        song: new Audio(
          "/sounds/music/retro-funk-energetic-background-music.mp3"
        ),
      },
      {
        name: "Freedom",
        song: new Audio("/sounds/music/desire-for-freedom.mp3"),
      },
      {
        name: "Christmas",
        song: new Audio(
          "/sounds/music/holiday-christmas-hip-hop-background-music.mp3"
        ),
      },
      { name: "Water Fluid", song: new Audio("/sounds/music/watr-fluid.mp3") },
    ],
    []
  )

  // State to keep track of a song being finished playing.
  const finishedSong = useRef(true)

  // The song that is currently playing
  const song = useRef(songs[0])
  const volume = useRef(DEFAULT_SETTINGS.defaultVolume)

  const [selectedSongs, setSelectedSongs] = useState<SongType[]>([song.current])

  useEffect(() => {
    if (selectedSongs.includes(song.current)) {
      return
    }

    pauseAllSongs()
    if (selectedSongs.includes(songs[0])) {
      playNewSong()
    } else {
      playNewSong()
    }
  }, [selectedSongs])

  // Function to set the volume
  const setVolume = (vol: number) => {
    if (!settings.music) return

    song.current.song.volume = vol
    volume.current = vol
  }

  // Function to play a new random song
  const playNewSong = () => {
    if (!settings.music) return

    const shuffle = selectedSongs.includes(songs[0])

    if (finishedSong.current && selectedSongs.length >= 1) {
      song.current.song.pause()
      song.current.song.currentTime = 0

      if (shuffle) {
        let randIdx = Math.floor(Math.random() * songs.length)

        do {
          randIdx = Math.floor(Math.random() * songs.length)
        } while (song.current === songs[randIdx])

        song.current = songs[randIdx]
      } else {
        song.current = selectedSongs[0]
      }
      song.current.song.play()
    }

    setVolume(volume.current)

    song.current.song.addEventListener("ended", playNewSong)
  }

  // Function to pause all songs
  const pauseAllSongs = () => {
    for (const song of songs) {
      song.song.pause()
      song.song.currentTime = 0
      song.song.removeEventListener("ended", playNewSong)
    }
  }

  useEffect(() => {
    for (const song of songs) {
      song.song.volume = DEFAULT_SETTINGS.defaultVolume
    }
  }, [])

  // Handling music playing
  useEffect(() => {
    if (started && settings.music) {
      playNewSong()
    } else {
      pauseAllSongs()
    }

    return () => song.current.song.removeEventListener("ended", playNewSong)
  }, [started, settings.music])

  // Exporting setVolume
  return { songs, setVolume, selectedSongs, setSelectedSongs }
}

export default useMusic
