import axios from "axios"
import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import jwt_decode from "jwt-decode"
import useAxios from "../components/hooks/useAxios"

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

  // Form errors
  const [errors, setErrors] = useState(null)

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
    <AuthContext.Provider value={value}>
      <SetStatus />
      {props.children}
    </AuthContext.Provider>
  )
}

const SetStatus = () => {
  const axiosInstance = useAxios()

  const { user } = useContext(AuthContext)

  // Change the user's status
  const changeStatus = async (status) => {
    try {
      console.log("status = ", status)
      await axiosInstance.put("api/change-user-status/", { status })
    } catch (error) {
      console.log(error)
    }
  }

  // Handle the tab closing
  const handleTabClosing = () => {
    changeStatus(false)
  }

  // Setting the satus of the user
  useEffect(() => {
    // User is logged in, so status = true
    user && changeStatus(true)

    // Event listener for when user closes the tab
    window.addEventListener("unload", handleTabClosing)

    return () => {
      window.removeEventListener("unload", handleTabClosing)
      changeStatus(false)
    }
  }, [user])
}

export default AuthContextProvider
