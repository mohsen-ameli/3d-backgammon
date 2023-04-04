import { useProgress } from "@react-three/drei"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Button from "../../components/ui/Button"

/**
 * Used for loading the experience of the user
 * @returns Loader with a progress bar and start button
 */

type LoaderProps = {
  toggleStarted: () => void
}

const Loader = ({ toggleStarted }: LoaderProps) => {
  const { loaded, total } = useProgress()

  const progress = Math.floor((loaded / total) * 100)

  const [done, setDone] = useState(false)
  const [forceRotation, setForceRotation] = useState(false)
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    window.matchMedia("(orientation: portrait)").matches
      ? "portrait"
      : "landscape"
  )

  const handleOrientation = () => {
    if (orientation === "landscape") {
      setDone(true)
      setForceRotation(false)
    } else if (orientation === "portrait") {
      setDone(false)
      setForceRotation(true)
    }
  }

  useEffect(() => handleOrientation(), [orientation])

  // Forcing users to be in landscape mode
  const handleOrientationChange = (e: MediaQueryListEvent) => {
    const portrait = e.matches

    if (portrait) {
      setOrientation("portrait")
    } else {
      setOrientation("landscape")
    }
  }

  useEffect(() => {
    window
      .matchMedia("(orientation: portrait)")
      .addEventListener("change", handleOrientationChange)

    return () => {
      window
        .matchMedia("(orientation: portrait)")
        .removeEventListener("change", handleOrientationChange)
    }
  }, [])

  useEffect(() => {
    if (progress === 100) handleOrientation()
  }, [progress])

  return (
    <motion.div
      className={`absolute inset-0 z-[30] flex h-screen w-screen flex-col items-center justify-center bg-gray-800 text-white`}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
    >
      <div className="flex w-[500px] items-center justify-center p-2">
        {!done ? (
          forceRotation ? (
            <Rotate />
          ) : (
            <div>
              <h1 className="my-8 text-center text-2xl">
                Loading your experience!
              </h1>
              <div className="w-full rounded-md bg-gray-300">
                <div
                  className="rounded-md bg-orange-800 p-2 text-center text-xs font-medium text-black"
                  style={{ width: `${progress}%` }}
                >
                  {progress}%
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4">
            <h1 className="text-3xl">Welcome to 3d-Backgammon!</h1>
            <Button className="px-16" onClick={toggleStarted}>
              Start The Experience
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

const Rotate = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <motion.i
        initial={{ rotateZ: 0 }}
        animate={{ rotateZ: 90 }}
        transition={{
          repeat: Infinity,
          duration: 2,
          repeatType: "reverse",
          type: "spring",
          bounce: 0.6,
        }}
        className="fa-solid fa-mobile-screen text-[80pt]"
      ></motion.i>
      <h1 className="text-2xl">Please rotate your device</h1>
    </div>
  )
}

export default Loader
