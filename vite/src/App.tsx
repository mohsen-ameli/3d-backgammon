import { Route, Routes } from "react-router-dom"
import NotFound from "./pages/NotFound"
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"
import FriendRequests from "./pages/friends/FriendRequests"
import FriendsList from "./pages/friends/FriendsList"
import SearchFriend from "./pages/friends/SearchFriend"
import Chat from "./pages/friends/chat/Chat"
import Interface from "./pages/interface/Interface"
import Profile from "./pages/profile/Profile"

import PrivateRoute from "./components/utils/PrivateRoute"
import GameRouter from "./game/GameRouter"
import Credits from "./pages/interface/Credits"

/**
 * Main application
 * @returns THE WEBSITE DUH
 */
const App = () => {
  return (
    <>
      <GameRouter />

      <Routes>
        {/* All game routes */}
        <Route path="/game/*" element={<></>} />

        {/* Public routes */}
        <Route path="/" element={<Interface />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

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

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
