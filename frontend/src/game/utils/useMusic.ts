import { useContext, useEffect, useMemo, useRef } from "react"
import { GameContext } from "../context/GameContext"

/**
 * Hook that handles song playing
 */
const useMusic = (started: boolean) => {
  const { settings } = useContext(GameContext)

  // All songs
  const songs = useMemo(() => {
    return [
      new Audio("/sounds/music/cinematic-documentary-piano.mp3"),
      new Audio("/sounds/music/cozy-evening.mp3"),
      new Audio("/sounds/music/desire-for-freedom.mp3"),
      new Audio("/sounds/music/electronic-future-beats.mp3"),
      new Audio("/sounds/music/energetic-upbeat-stylish-pop-fashion.mp3"),
      new Audio("/sounds/music/hip-hop-energetic-vlog-background-music.mp3"),
      new Audio("/sounds/music/holiday-christmas-hip-hop-background-music.mp3"),
      new Audio("/sounds/music/inspirational-piano.mp3"),
      new Audio("/sounds/music/password-infinity.mp3"),
      new Audio("/sounds/music/retro-funk-energetic-background-music.mp3"),
      new Audio("/sounds/music/watr-fluid.mp3"),
    ]
  }, [])

  // State to keep track of a song being finished playing.
  const finishedSong = useRef(true)

  // Handling music playing
  useEffect(() => {
    let randSong = songs[0]

    const playNewSong = () => {
      if (!settings.music) return

      if (finishedSong.current) {
        randSong.pause()
        randSong.currentTime = 0

        const randIdx = Math.floor(Math.random() * songs.length)
        randSong = songs[randIdx]
        randSong.play()
      }
      randSong.addEventListener("ended", playNewSong)
    }

    if (started && settings.music) {
      playNewSong()
    } else {
      for (const song of songs) {
        song.pause()
        song.currentTime = 0
      }
    }

    return () => randSong.removeEventListener("ended", playNewSong)
  }, [started, settings.music])
}

export default useMusic
