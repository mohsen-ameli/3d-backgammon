import { useContext } from "react"
import { Link } from "react-router-dom"
import Button from "../../components/ui/Button"
import Container from "../../components/ui/Container"
import { AuthContext } from "../../context/AuthContext"

/**
 * AKA the homepage
 */
const Interface = () => {
  const { user, logout } = useContext(AuthContext)

  return (
    <Container className="z-10 justify-between">
      <div className="flex w-full items-center justify-evenly gap-x-8">
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

      <h1 className="text-center text-2xl font-bold">
        Welcome to 3D Backgammon
      </h1>

      <div className="flex justify-center gap-x-8">
        {/* <Link to="/play-random">
          <Button>Play With a Random</Button>
        </Link> */}
        <Link to="/pass-and-play">
          <Button>Pass & Play</Button>
        </Link>
      </div>
    </Container>
  )
}

export default Interface
