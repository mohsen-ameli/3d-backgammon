import { Route, Routes } from "react-router-dom"
import FriendsList from "./pages/friends/FriendsList"
import Interface from "./pages/interface/Interface"
import Login from "./pages/auth/Login"
import PlayRandom from "./game/PlayRandom"
import Signup from "./pages/auth/Signup"
import SearchFriend from "./pages/friends/SearchFriend"
import Chat from "./pages/friends/Chat"
import FriendRequests from "./pages/friends/FriendRequests"
import PrivateRoute from "./components/utils/PrivateRoute"
import PassAndPlay from "./game/PassAndPlay"
import Profile from "./pages/profile/Profile"
import FriendGame from "./game/FriendGame"
import useStatus from "./UserStatus"
import NotFound from "./pages/NotFound"
import Experience from "./game/Experience"

const App = () => {
  // Getting the user status. (Game requests and game request rejections)
  useStatus()

  return (
    <>
      <Experience />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Interface />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/play-random" element={<PlayRandom />} />
        <Route path="/pass-and-play" element={<PassAndPlay />} />

        {/* Private routes */}
        <Route
          path="/friends"
          element={
            <PrivateRoute>
              <FriendsList />
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
        <Route
          path="/game/:gameId"
          element={
            <PrivateRoute>
              <FriendGame />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
