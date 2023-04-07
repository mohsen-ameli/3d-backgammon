import { AnimatePresence } from "framer-motion"
import { Suspense, useState } from "react"
import { Route, Routes } from "react-router-dom"
import PrivateRoute from "../components/utils/PrivateRoute"
import Experience from "./Experience"
import GameContextProvider from "./context/GameContext"
import FriendGame from "./modes/FriendGame"
import PassAndPlay from "./modes/PassAndPlay"
import PlayRandom from "./modes/PlayRandom"
import Layout from "./ui/Layout"
import Loader from "./ui/Loader"

/**
 * The router that contains the game context, experience, layout, and the game routes.
 */
const GameRouter = () => {
  const [started, setStarted] = useState(false)
  const toggleStarted = () => setStarted(true)

  return (
    <>
      <Suspense fallback={null}>
        <GameContextProvider>
          <Experience />
          <Layout />

          <Routes>
            <Route
              path="/game/:gameId"
              element={
                <PrivateRoute>
                  <FriendGame />
                </PrivateRoute>
              }
            />
            <Route path="/game/play-random" element={<PlayRandom />} />
            <Route
              path="/game/pass-and-play"
              element={<PassAndPlay started={started} />}
            />
          </Routes>
        </GameContextProvider>
      </Suspense>

      {/* Loading screen */}
      <AnimatePresence mode="wait">
        {!started && <Loader toggleStarted={toggleStarted} />}
      </AnimatePresence>
    </>
  )
}
export default GameRouter
