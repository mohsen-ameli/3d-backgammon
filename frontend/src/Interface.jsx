import { useState } from "react"
import { Link } from "react-router-dom"
import Button from "./components/ui/Button"
import Container from "./components/ui/Container"

const Interface = () => {
  const [authenticated, setAuthenticated] = useState(true)

  const login = () => {
    setAuthenticated(true)
  }

  const logout = () => {
    setAuthenticated(false)
  }
  return (
    <Container>
      <div className="w-full flex gap-x-8 items-center justify-evenly">
        {authenticated ? (
          <>
            <Button onClick={logout}>Log Out</Button>
            <Button>Profile</Button>
            <Button>Friends</Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button onClick={login}>Login</Button>
            </Link>
            <Link to="/signup">
              <Button>Sign Up</Button>
            </Link>
          </>
        )}
      </div>

      <h1 className="text-2xl font-bold text-center">
        Welcome to 3D Backgammon
      </h1>

      <div className="flex gap-x-8 justify-center">
        <Link to="/play-random">
          <Button>Play With a Random</Button>
        </Link>
        <Button>Pass & Play</Button>
      </div>
    </Container>
  )
}

export default Interface
