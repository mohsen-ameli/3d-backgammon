"use client"

import Button from "@/components/ui/Button"
import { ITEMS_TO_LOAD } from "@/game/data/Data"
import { useGameStore } from "@/game/store/useGameStore"
import { faMobileScreen } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useProgress } from "@react-three/drei"
import { AnimatePresence, motion } from "framer-motion"
import React, { useEffect, useState } from "react"

const deviceOrientation = typeof window !== "undefined" ? window.matchMedia("(orientation: portrait)").matches : false

/**
 * Used for loading the experience of the user
 * @returns Loader with a progress bar and start button
 */
export default function Loading() {
  const { loaded } = useProgress()

  const progress = (loaded / ITEMS_TO_LOAD) * 100

  const started = useGameStore(state => state.started)

  const [forceRotation, setForceRotation] = useState(false)

  // Setting event listeners for when user changes orientation
  useEffect(() => {
    // Handling orientation for the first time
    handleOrientation(deviceOrientation ? "portrait" : "landscape")

    const device = window.matchMedia("(orientation: portrait)")

    device.addEventListener("change", handleOrientationChange)

    return () => {
      device.removeEventListener("change", handleOrientationChange)
    }
  }, [])

  // Forcing users to be in landscape mode
  function handleOrientationChange(e: MediaQueryListEvent) {
    handleOrientation(e.matches ? "portrait" : "landscape")
  }

  // Forces rotation based on orientation
  function handleOrientation(orientation: "portrait" | "landscape") {
    setForceRotation(orientation === "landscape" ? false : true)
  }

  return (
    <AnimatePresence mode="wait">
      {!started && (
        <motion.div
          className="absolute inset-0 z-[30] flex h-screen w-screen flex-col items-center justify-center bg-gray-800 text-white"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1 } }}
        >
          {progress < 100 ? <Loader progress={progress} /> : forceRotation ? <Rotate /> : <Start started={started} />}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Loader({ progress }: { progress: number }) {
  return (
    <>
      <div className="my-4 w-[400px] lg:w-[500px]">
        <div
          className="rounded-md bg-orange-800 px-2 py-[2px] text-center text-xs font-medium text-black"
          style={{ width: `${Math.round(progress)}%` }}
        />
      </div>
      <h1 className="text-lg md:text-xl">{Math.round(progress)}% loaded</h1>
    </>
  )
}

function Start({ started }: { started: boolean }) {
  function startExperience() {
    useGameStore.setState({ started: true })
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <h1 className="text-3xl">Welcome to 3D Backgammon!</h1>
      <Button disabled={started} className="px-16" onClick={startExperience}>
        Start The Experience
      </Button>
    </div>
  )
}

function Rotate() {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <FontAwesomeIcon icon={faMobileScreen} className="rotate-anim infinite text-[80pt]" />
      <h1 className="text-2xl">Please rotate your device</h1>
    </div>
  )
}
