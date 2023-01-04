import axios from "axios"
import jwt_decode from "jwt-decode"
import { AuthContext } from "../../context/AuthContext"
import { useContext } from "react"

/**
 * Hook used for all types of fetch requests. (Usually not GET, because useFetch handles that)
 * @returns AxiosInstance -> Axios instance with the access token
 */

const useAxios = () => {
  const { tokens, setTokens, setUser } = useContext(AuthContext)

  // Creating an axios instance with the access token
  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${tokens?.access}`,
    },
  })

  // Interceptor to check if the access token is expired
  axiosInstance.interceptors.request.use(async (request) => {
    // Checking if the access token is expired
    const expire = jwt_decode(tokens.access).exp
    const now = Date.now() / 1000

    // Access token is not expired
    if (now < expire) return request

    // Access token is expired. Will use the refresh token to get a new access token
    try {
      const response = await axios.post("/api/token/refresh/", {
        refresh: tokens.refresh,
      })

      if (response.status === 200) {
        const newTokens = {
          access: response.data.access,
          refresh: tokens.refresh,
        }

        // Saving the new tokens to local storage
        localStorage.setItem("tokens", JSON.stringify(newTokens))

        setUser(jwt_decode(response.data.access))
        setTokens(newTokens)

        // Setting new access token to the axios instance
        request.headers.Authorization = `Bearer ${response.data.access}`
        return request
      }
    } catch (error) {
      console.log(error)
    }
  })

  return axiosInstance
}

export default useAxios
