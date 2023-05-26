import React, { useContext } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

type PrivateRouteProps = { children: React.ReactNode }

/**
 * Private route for routes which are only for authed users
 * @param {*} children -> The component to be rendered
 * @returns The children...
 */
const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user } = useContext(AuthContext)
  const location = useLocation()

  if (!user) return <Navigate to="/login" state={{ from: location }} />

  return <>{children}</>
}

export default PrivateRoute
