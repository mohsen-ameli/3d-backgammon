import { useProgress } from "@react-three/drei"
import { motion } from "framer-motion"
import Button from "./Button"

/**
 * Used for loading the experience of the user
 * @returns Loader with a progress bar and start button
 */

type LoaderProps = {
  toggleStarted: () => void
}

const Loader = ({ toggleStarted }: LoaderProps) => {
  const { progress } = useProgress()

  // const bar = ((loaded / total) * 100).toFixed(1)

  return (
    <motion.div
      className={`absolute inset-0 z-[30] flex h-screen w-screen flex-col items-center justify-center bg-gray-800 text-white`}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
    >
      <div className="flex w-[300px] items-center justify-center p-2">
        {progress < 100 ? (
          <div>
            <h1 className="my-8 text-center text-2xl">
              Loading your experience!
            </h1>
            <div className="w-full rounded-md bg-gray-200">
              <div
                className="rounded-md bg-orange-800 p-2 text-center text-xs font-medium"
                style={{ width: `${progress}%` }}
              >
                {progress}%
              </div>
            </div>
          </div>
        ) : (
          <Button className="px-16" onClick={toggleStarted}>
            Start The Experience
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export default Loader
