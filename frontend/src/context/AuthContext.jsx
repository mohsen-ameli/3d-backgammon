import axios from "axios"
import { createContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import jwt_decode from "jwt-decode"
import getServerUrl from "../components/utils/getServerUrl"

export const AuthContext = createContext()

/**
 * Auth provider for the entire app. Responsible for logging users in, and out.
 * TODO: Try to get rid of the couple game related states in this component.
 * @param {*} props -> All of the children of the different pages
 * @returns A context provider
 */
const AuthContextProvider = (props) => {
  // Navigate
  const navigate = useNavigate()

  // Game mode
  const gameMode = useRef()

  // Whether the user is in game or not
  const [inGame, setInGame] = useState(false)

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

  // Connection for changing the status of the user (backend)
  const [ws, setWs] = useState(() => {})

  // Setting the websocket connection, if ther's a user and a valid token
  useEffect(() => {
    if (user && tokens)
      setWs(() => new WebSocket(`${getServerUrl(false)}/ws/status/${tokens.refresh}/`)) // prettier-ignore
  }, [])

  // Login
  const login = async (username, password) => {
    try {
      const context = {
        username,
        password,
      }

      const res = await axios.post(`${getServerUrl()}/api/token/`, context)
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
        if (ws && ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify({ new_refresh: newTokens.refresh, is_online: true }))
        } else {
          setWs(() => new WebSocket(`${getServerUrl(false)}/ws/status/${newTokens.refresh}/`))
        }

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

      const res = await axios.post(`${getServerUrl()}/api/signup/`, context)

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
    inGame,
    gameMode,
    ws,
    user,
    tokens,
    errors,
    setErrors,
    setUser,
    setTokens,
    setInGame,
    login,
    logout,
    signup,
  }

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  )
}

export default AuthContextProvider
