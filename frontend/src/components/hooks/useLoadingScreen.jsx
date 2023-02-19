import { Html, useProgress } from "@react-three/drei"

const useLoadingScreen = () => {
  const { active, progress, errors, item, loaded, total } = useProgress()

  // const bar = progress > 0 ? progress.toFixed(1) : 100
  // const bar = progress.toFixed(1)
  const bar = ((loaded / total) * 100).toFixed(1)

  return (
    <Html
      center
      className="absolute inset-0 w-screen h-screen flex flex-col items-center justify-center bg-gray-500"
    >
      <div className="w-[300px] p-2">
        <h1 className="text-2xl text-center my-8">Loading your experience!</h1>
        <div className="w-full bg-gray-200 rounded-md">
          <div
            className="p-2 rounded-md bg-orange-800 text-xs font-medium text-black text-center"
            style={{ width: `${bar}%` }}
          >
            {bar}%
          </div>
        </div>
      </div>
    </Html>
  )
  // return <Html center>{progress > 0 ? progress.toFixed(1) : 100} % loaded</Html>
}

export default useLoadingScreen
