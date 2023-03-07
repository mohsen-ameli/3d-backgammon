import { Route, Routes } from "react-router-dom"
import PrivateRoute from "../components/utils/PrivateRoute"
import Experience from "./Experience"
import GameContextProvider from "./context/GameContext"
import FriendGame from "./modes/FriendGame"
import PassAndPlay from "./modes/PassAndPlay"
import PlayRandom from "./modes/PlayRandom"
import Layout from "./ui/Layout"

const GameRouter = () => {
  return (
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
        <Route path="/game/pass-and-play" element={<PassAndPlay />} />
      </Routes>
    </GameContextProvider>
  )
}
export default GameRouter
