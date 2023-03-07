import { Route, Routes } from "react-router-dom"
import Interface from "./pages/interface/Interface"
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"
import SearchFriend from "./pages/friends/SearchFriend"
import Chat from "./pages/friends/chat/Chat"
import FriendRequests from "./pages/friends/FriendRequests"
import NotFound from "./pages/NotFound"
import Profile from "./pages/profile/Profile"
import FriendsList from "./pages/friends/FriendsList"

import PrivateRoute from "./components/utils/PrivateRoute"
import GameRouter from "./game/GameRouter"

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
