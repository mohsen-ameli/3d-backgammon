import { useContext } from "react"
import { Link } from "react-router-dom"
import Button from "../../components/ui/Button"
import Container from "../../components/ui/Container"
import { AuthContext } from "../../context/AuthContext"

const Interface = () => {
  const { user, logout } = useContext(AuthContext)

  return (
    <Container className="justify-between">
      <div className="w-full flex gap-x-8 items-center justify-evenly">
        {user ? (
          <>
            <Button onClick={logout}>Log Out</Button>
            <Link to="/profile">
              <Button>Profile</Button>
            </Link>
            <Link to="/friends">
              <Button>Friends</Button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button>Login</Button>
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
        <Link to="/pass-and-play">
          <Button>Pass & Play</Button>
        </Link>
      </div>
    </Container>
  )
}

export default Interface
