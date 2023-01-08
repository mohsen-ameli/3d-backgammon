import axios from "axios"
import jwt_decode from "jwt-decode"
import { AuthContext } from "../../context/AuthContext"
import { useContext } from "react"
import useGetFreshTokens from "./useGetFreshTokens"

/**
 * Hook used for all types of fetch requests. (Usually not GET, because useFetch handles that)
 * @returns Axios instance with the access token
 */
const useAxios = () => {
  const { tokens } = useContext(AuthContext)
  const getFreshTokens = useGetFreshTokens(tokens, true)

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

    // Access token is expired, so getting fresh tokens
    const freshTokens = await getFreshTokens()

    // Returning the original request
    request.headers.Authorization = `Bearer ${freshTokens.access}`
    return request
  })

  return axiosInstance
}

export default useAxios
