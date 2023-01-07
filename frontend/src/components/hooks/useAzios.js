import axios from "axios"
import jwt_decode from "jwt-decode"
import { useState } from "react"

/**
 * Same exact thing as useAxios, but we don't use the context api.
 */
const useAzios = () => {
  const [tokens] = useState(
    localStorage.getItem("tokens")
      ? JSON.parse(localStorage.getItem("tokens"))
      : ""
  )

  // Creating an axios instance with the access token
  const aziosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${tokens?.access}`,
    },
  })

  // Interceptor to check if the access token is expired
  aziosInstance.interceptors.request.use(async (request) => {
    // Checking if the access token is expired
    const expire = jwt_decode(tokens?.access).exp
    const now = Date.now() / 1000

    // Access token is not expired
    if (now < expire) return request

    // Access token is expired. Will use the refresh token to get a new access token
    try {
      const response = await axios.post("/api/token/refresh/", {
        refresh: tokens?.refresh,
      })

      if (response.status === 200) {
        // Setting new access token to the axios instance
        request.headers.Authorization = `Bearer ${response.data.access}`
        return request
      }
    } catch (error) {
      console.log("error:", error)
    }
  })

  return aziosInstance
}

export default useAzios
