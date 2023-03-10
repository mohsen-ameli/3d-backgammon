import axios, { AxiosError } from "axios"
import { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import jwt_decode from "jwt-decode"
import getServerUrl from "../components/utils/getServerUrl"
import { UserType } from "./User.type"
import { TokenType } from "./Token.type"
import { ErrorType } from "./Error.type"
import { AuthContextType } from "./Context.type"
import { Children } from "../components/types/children.type"
import { ImageType } from "../components/types/Image.type"

export const AuthContext = createContext({} as AuthContextType)

/**
 * Auth provider for the entire app. Responsible for logging users in, and out.
 */
const AuthContextProvider = ({ children }: Children) => {
  // Navigate
  const navigate = useNavigate()

  // User authentication info
  const [user, setUser] = useState<UserType>(() =>
    localStorage.getItem("tokens")
      ? jwt_decode(JSON.parse(localStorage.getItem("tokens")!).access)
      : null
  )

  // Access and refresh tokens
  const [tokens, setTokens] = useState<TokenType>(() =>
    localStorage.getItem("tokens")
      ? JSON.parse(localStorage.getItem("tokens")!)
      : ""
  )

  // Form errors
  const [errors, setErrors] = useState<ErrorType>(null)

  // Connection for changing the status of the user (backend)
  const [ws, setWs] = useState<WebSocket>()

  // Setting the websocket connection, if ther's a user and a valid token
  useEffect(() => {
    if (user && tokens)
      setWs(() => new WebSocket(`${getServerUrl(false)}/ws/status/${tokens.refresh}/`)) // prettier-ignore
  }, [])

  // Login
  const login = async (username: string, password: string) => {
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
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError)
        setErrors({
          message: error.response?.data.detail,
          code: "password",
        })
    }
  }

  // Logout
  const logout = async () => {
    // Save tokens to local storage
    localStorage.removeItem("tokens")

    // Set tokens
    setTokens(null)
    setUser(null)

    if (ws) {
      ws.send(JSON.stringify({ is_online: false }))
      ws.close()
      setWs(undefined)
    }

    // Going home
    navigate("/")
    setErrors(null)
  }

  // Sign up
  const signup = async (
    username: string,
    email: string,
    password: string,
    password2: string,
    image: ImageType
  ) => {
    try {
      const newImage =
        image &&
        new File([image.file], username + ".jpg", {
          type: "image/jpeg",
        })

      const context = {
        username,
        email,
        password,
        password2,
        image: newImage,
      }

      const config = image
        ? {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        : {}

      const res = await axios.post(
        `${getServerUrl()}/api/signup/`,
        context,
        config
      )

      if (res.status === 200) {
        // Going home
        navigate("/login")
        setErrors(null)
      }
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) setErrors(error.response?.data)
    }
  }

  // Context value
  const value = {
    ws,
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContextProvider
