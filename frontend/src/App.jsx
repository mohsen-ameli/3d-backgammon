import { Canvas } from "@react-three/fiber"
import { BrowserRouter, Route, Router, Routes } from "react-router-dom"
import Game from "./Game"
import Interface from "./Interface"
import Login from "./Login"
import PlayRandom from "./PlayRandom"
import Signup from "./Signup"

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Interface />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/play-random" element={<PlayRandom />} />
        </Routes>
      </BrowserRouter>

      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <Game />
      </Canvas>
    </>
  )
}

export default App
