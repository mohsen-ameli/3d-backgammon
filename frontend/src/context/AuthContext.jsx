import axios from "axios"
import { createContext, useEffect, useState } from "react"
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
      : ""
  )
  // Form errors
  const [errors, setErrors] = useState(null)

  // Connection for changing the status of the user
  const [ws, setWs] = useState(() => {})
  useEffect(() => {
    if (user && tokens) {
      // prettier-ignore
      setWs(() => new WebSocket(`ws://localhost:8000/ws/status/${tokens.refresh}/`))
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

        // prettier-ignore
        if (ws && isOpen(ws)) {
          ws.send(JSON.stringify({ new_refresh: newTokens.refresh, is_online: true }))
        } else {
          setWs(() => new WebSocket(`ws://localhost:8000/ws/status/${newTokens.refresh}/`))
        }

        // Going home
        navigate("/")
        setErrors(null)
      }
    } catch (error) {
      console.log(error)
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

    // prettier-ignore
    ws && ws.send(JSON.stringify({ is_online: false }))

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

function isOpen(ws) {
  return ws?.readyState === ws?.OPEN
}

export default AuthContextProvider