import axios from "axios"
import { createContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import jwt_decode from "jwt-decode"

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
      : null
  )

  // Login
  const login = async (username, password) => {
    try {
      const context = {
        username,
        password,
      }

      const res = await axios.post("api/token/", context)
      if (res.status === 200) {
        const tokens = {
          access: res.data.access,
          refresh: res.data.refresh,
        }
        // Save tokens to local storage
        localStorage.setItem("tokens", JSON.stringify(tokens))

        // Set tokens
        setTokens(tokens)
        setUser(jwt_decode(tokens.access))

        // Going home
        navigate("/")
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Logout
  const logout = async () => {
    // Save tokens to local storage
    localStorage.removeItem("tokens")

    // Set tokens
    setTokens(null)
    setUser(null)

    // Going home
    navigate("/")
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
      const res = await axios.post("/api/signup/", context)
      if (res.status === 200) {
        // Going home
        navigate("/login")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const value = {
    user,
    tokens,
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
