import { Canvas } from "@react-three/fiber"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import AuthContextProvider from "./context/AuthContext"
import Friends from "./pages/friends/Friends"
import Game from "./Game"
import Interface from "./pages/interface/Interface"
import Login from "./pages/auth/Login"
import PlayRandom from "./PlayRandom"
import Signup from "./pages/auth/Signup"
import SearchFriend from "./pages/friends/SearchFriend"
import Chat from "./pages/friends/Chat"
import FriendRequests from "./pages/friends/FriendRequests"
import PrivateRoute from "./components/utils/PrivateRoute"
import PassAndPlay from "./PassAndPlay"
import Profile from "./pages/profile/Profile"

const App = () => {
  return (
    <>
      <BrowserRouter>
        <AuthContextProvider>
          <Routes>
            <Route path="/" element={<Interface />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/play-random" element={<PlayRandom />} />
            <Route path="/pass-and-play" element={<PassAndPlay />} />

            {/* Private Routes */}
            <Route
              path="/friends"
              element={
                <PrivateRoute>
                  <Friends />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/search-friend"
              element={
                <PrivateRoute>
                  <SearchFriend />
                </PrivateRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              }
            />
            <Route
              path="/friend-requests"
              element={
                <PrivateRoute>
                  <FriendRequests />
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthContextProvider>
      </BrowserRouter>

      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <Game />
      </Canvas>
    </>
  )
}

export default App
