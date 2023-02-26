import { Html, useProgress } from "@react-three/drei"

/**
 * Used for loading the experience of the user
 * @returns Some html code, with a progress bar
 */
const useLoadingScreen = () => {
  const { loaded, total } = useProgress()

  const bar = ((loaded / total) * 100).toFixed(1)

  return (
    <Html
      center
      className="absolute inset-0 flex h-screen w-screen flex-col items-center justify-center bg-gray-500"
    >
      <div className="w-[300px] p-2">
        <h1 className="my-8 text-center text-2xl">Loading your experience!</h1>
        <div className="w-full rounded-md bg-gray-200">
          <div
            className="rounded-md bg-orange-800 p-2 text-center text-xs font-medium text-black"
            style={{ width: `${bar}%` }}
          >
            {bar}%
          </div>
        </div>
      </div>
    </Html>
  )
}

export default useLoadingScreen
