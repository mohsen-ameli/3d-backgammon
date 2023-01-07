import axios from "axios"
import { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import jwt_decode from "jwt-decode"
import useSetStatus from "../components/hooks/useSetStatus"

export const AuthContext = createContext()

const AuthContextProvider = (props) => {
  // Navigate
  const navigate = useNavigate()

  // User authentication info
  const [user, setUser] = useState(() =>
    localStorage.getItem("tokens")
      ? jwt_decode(JSON.parse(localStorage.getItem("tokens")).access)
      : null
  )
  // Access and refresh tokens
  const [tokens, setTokens] = useState(() =>
    localStorage.getItem("tokens")
      ? JSON.parse(localStorage.getItem("tokens"))
      : ""
  )
  // Form errors
  const [errors, setErrors] = useState(null)

  // Setting the satus of the user
  const { changeStatus } = useSetStatus()
  useEffect(() => {
    // If there is a user, set their status to true
    user && changeStatus(true)

    // When the component unmounts, set status to false
    return () => {
      changeStatus(false)
      console.log("unmounting")
    }
  }, [])

  // Login
  const login = async (username, password) => {
    try {
      const context = {
        username,
        password,
      }

      const res = await axios.post("api/token/", context)
      if (res.status === 200) {
        const newTokens = {
          access: res.data.access,
          refresh: res.data.refresh,
        }
        // Save tokens to local storage
        localStorage.setItem("tokens", JSON.stringify(newTokens))

        // Set tokens
        setTokens(newTokens)
        setUser(jwt_decode(newTokens.access))
        // THIS IS WHERE THE ERROR IS
        changeStatus(true)

        // Going home
        navigate("/")
        setErrors(null)
      }
    } catch (error) {
      setErrors({ message: error.response.data.detail, code: "password" })
    }
  }

  // Logout
  const logout = async () => {
    // Save tokens to local storage
    localStorage.removeItem("tokens")

    // Set tokens
    setTokens(null)
    setUser(null)

    changeStatus(false)

    // Going home
    navigate("/")
    setErrors(null)
  }

  // Sign up
  const signup = async (username, email, password, password2) => {
    try {
      const context = {
        username,
        email,
        password,
        password2,
      }
      const res = await axios.post("api/signup/", context)
      if (res.status === 200) {
        // Going home
        navigate("/login")
        setErrors(null)
      }
    } catch (error) {
      setErrors(error.response.data)
    }
  }

  // Context value
  const value = {
    user,
    tokens,
    errors,
    setErrors,
    setUser,
    setTokens,
    login,
    logout,
    signup,
  }

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  )
}

export default AuthContextProvider
