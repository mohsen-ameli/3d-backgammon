import { useContext } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext)
  let location = useLocation()

  if (!user) return <Navigate to="/login" state={{ from: location }} />

  return children
}

export default PrivateRoute
