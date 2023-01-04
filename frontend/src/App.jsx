import { Canvas } from "@react-three/fiber"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import AuthContextProvider from "./context/AuthContext"
import Friends from "./pages/friends/Friends"
import Game from "./Game"
import Interface from "./Interface"
import Login from "./pages/auth/Login"
import PlayRandom from "./PlayRandom"
import Signup from "./pages/auth/Signup"
import SearchFriend from "./pages/friends/SearchFriend"
import Chat from "./pages/friends/Chat"

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
            <Route path="/friends" element={<Friends />} />
            <Route path="/search-friend" element={<SearchFriend />} />
            <Route path="/chat/:uuid" element={<Chat />} />
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
