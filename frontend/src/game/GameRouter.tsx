import { Route, Routes } from "react-router-dom"
import PrivateRoute from "../components/utils/PrivateRoute"
import Experience from "./Experience"
import GameWrapperProvider from "./context/GameWrapperContext"
import FriendGame from "./modes/FriendGame"
import PassAndPlay from "./modes/PassAndPlay"
import PlayRandom from "./modes/PlayRandom"
import Layout from "./ui/Layout"

const GameRouter = () => {
  return (
    <GameWrapperProvider>
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
        <Route path="/game/pass-and-play" element={<PassAndPlay />} />
      </Routes>
    </GameWrapperProvider>
  )
}
export default GameRouter
