import { useContext } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

/**
 * Private route for routes which are only for authed users
 * @param {*} children -> The component to be rendered
 * @returns The children...
 */
const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext)
  let location = useLocation()

  if (!user) return <Navigate to="/login" state={{ from: location }} />

  return children
}

export default PrivateRoute
