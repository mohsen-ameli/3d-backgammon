import { useContext } from "react"
import { Link } from "react-router-dom"
import Button3d from "../../components/ui/3d-button/Button3d"
import { AuthContext } from "../../context/AuthContext"

/**
 * AKA the homepage
 */
const Interface = () => {
  const { user, logout } = useContext(AuthContext)

  return (
    <div className="absolute -bottom-[25%] z-[10] h-[55%] w-full rounded-t-[50%] bg-[#ffffffac]">
      <div className="relative flex items-center justify-evenly gap-x-12">
        {user ? (
          <>
            <Button3d
              text="Logout"
              className="absolute bottom-0"
              onClick={logout}
            />
            <Link to="/profile">
              <Button3d text="Profile" className="absolute bottom-14" />
            </Link>
            <Link to="/friends">
              <Button3d text="Friends" className="absolute bottom-14" />
            </Link>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button3d text="Log In" className="absolute bottom-10" />
            </Link>
            <Link to="/signup">
              <Button3d text="Sign Up" className="absolute bottom-20" />
            </Link>
          </>
        )}
        <Link to="/game/pass-and-play">
          <Button3d
            text="Single Player"
            className={`absolute ${user ? "bottom-0" : "bottom-10"}`}
          />
        </Link>
      </div>
    </div>
  )
}

export default Interface
