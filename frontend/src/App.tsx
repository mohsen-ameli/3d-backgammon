import { Route, Routes } from 'react-router-dom'
import Interface from './pages/interface/Interface'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import SearchFriend from './pages/friends/SearchFriend'
import Chat from './pages/friends/chat/Chat'
import FriendRequests from './pages/friends/FriendRequests'
import NotFound from './pages/NotFound'
import Profile from './pages/profile/Profile'
import FriendsList from './pages/friends/FriendsList'

import useStatus from './components/hooks/useStatus'
import PrivateRoute from './components/utils/PrivateRoute'

import Experience from './game/Experience'
import PlayRandom from './game/modes/PlayRandom'
import PassAndPlay from './game/modes/PassAndPlay'
import FriendGame from './game/modes/FriendGame'

/**
 * Main application
 * @returns THE WEBSITE DUH
 */
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
