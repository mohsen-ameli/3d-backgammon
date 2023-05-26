import { useEffect, useMemo, useRef } from "react"
import { DEFAULT_SONG } from "../data/Data"
import { useGameStore } from "../store/useGameStore"
import { Song } from "../types/Song.type"
import { shallow } from "zustand/shallow"

/**
 * Hook that handles song playing
 */
export default function useMusic() {
  const started = useGameStore(state => state.started)
  const { settings, selectedSongs } = useGameStore(
    state => ({
      settings: state.settings,
      selectedSongs: state.selectedSongs,
    }),
    shallow,
  )

  // Playing or pausing songs whenever user toggles the music switch
  // useGameStore.subscribe(
  //   state => state.settings,
  //   settings => !settings.music && pauseAllSongs(),
  //   { equalityFn: shallow },
  // )

  // All songs
  const songs: Song[] = useMemo(
    () => [
      DEFAULT_SONG,
      {
        name: "Mild Piano",
        src: "/sounds/music/cinematic-documentary-piano.mp3",
        song: null,
      },
      {
        name: "Cozy Evening",
        src: "/sounds/music/cozy-evening.mp3",
        song: null,
      },
      {
        name: "Future Beats",
        src: "/sounds/music/electronic-future-beats.mp3",
        song: null,
      },
      {
        name: "Pop Fashion",
        src: "/sounds/music/energetic-upbeat-stylish-pop-fashion.mp3",
        song: null,
      },
      {
        name: "Hip Hop",
        src: "/sounds/music/hip-hop-energetic-vlog-background-music.mp3",
        song: null,
      },
      {
        name: "Wild Piano",
        src: "/sounds/music/inspirational-piano.mp3",
        song: null,
      },
      {
        name: "Infinity",
        src: "/sounds/music/password-infinity.mp3",
        song: null,
      },
      {
        name: "Retro Funk",
        src: "/sounds/music/retro-funk-energetic-background-music.mp3",
        song: null,
      },
      {
        name: "Freedom",
        src: "/sounds/music/desire-for-freedom.mp3",
        song: null,
      },
      {
        name: "Christmas",
        src: "/sounds/music/holiday-christmas-hip-hop-background-music.mp3",
        song: null,
      },
      {
        name: "Water Fluid",
        src: "/sounds/music/watr-fluid.mp3",
        song: null,
      },
    ],
    [],
  )

  // State to keep track of a song being finished playing.
  const finishedSong = useRef(true)

  // The song that is currently playing
  const song = useRef(songs[0])

  // Initializing store
  useEffect(() => {
    useGameStore.setState({ songs, setVolume, selectedSongs })

    // Setting default volumes for songs
    // for (const song of songs) {
    //   song.song.volume = DEFAULT_SETTINGS.defaultVolume
    // }
  }, [])

  // Playing the initial song
  useEffect(() => {
    if (started && settings.music) {
      playNewSong()
    } else {
      pauseAllSongs()
    }

    return () => song.current.song?.removeEventListener("ended", playNewSong)
  }, [started, settings.music])

  useEffect(() => {
    if (selectedSongs?.includes(song.current)) {
      return
    }

    pauseAllSongs()
    if (selectedSongs?.includes(songs[0])) {
      playNewSong()
    } else {
      playNewSong()
    }
  }, [selectedSongs])

  // Function to set the volume
  function setVolume(volume: number) {
    if (!useGameStore.getState().settings.music || !song.current.song) return

    song.current.song.volume = volume
    useGameStore.setState({ volume })
  }

  // Function to play a new random song
  function playNewSong() {
    if (!useGameStore.getState().settings.music) return

    const shuffle = selectedSongs.includes(songs[0])

    if (finishedSong.current && selectedSongs.length >= 1) {
      if (song.current.song) {
        song.current.song.pause()
        song.current.song.currentTime = 0
      }

      if (shuffle) {
        let randIdx = Math.floor(Math.random() * songs.length)

        do {
          randIdx = Math.floor(Math.random() * songs.length)
        } while (song.current === songs[randIdx])

        song.current = songs[randIdx]
      } else {
        song.current = selectedSongs[0]
      }

      song.current.song = new Audio(song.current.src)
      song.current.song.volume = useGameStore.getState().volume
      song.current.song.play()
    }

    song.current.song?.addEventListener("ended", playNewSong)
  }

  // Function to pause all songs
  function pauseAllSongs() {
    for (const song of songs) {
      if (song.song) {
        song.song.pause()
        song.song.currentTime = 0
        song.song.removeEventListener("ended", playNewSong)
      }
    }
  }
}
