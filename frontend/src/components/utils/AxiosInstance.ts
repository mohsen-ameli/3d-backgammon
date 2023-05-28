import axios from "axios"
import { Session } from "next-auth"
import getServerUrl from "./getServerUrl"
import getJWTToken from "./getJWTToken"

/**
 * Hook used for all types of fetch requests. (Usually not GET, because useFetch handles that)
 * @returns Axios instance with the access token
 */
export default function AxiosInstance(session: Session) {
  const axiosInstance = axios.create()

  // Intercepting the axios instance
  axiosInstance.interceptors.request.use(async request => {
    // Changing the url, so we dynamically hit the server based
    // on if we're in production or development
    request.url = getServerUrl() + request.url

    // Getting fresh JWT tokens
    const { access } = await getJWTToken(session.user)

    // Returning the original request
    request.headers.Authorization = `Bearer ${access}`

    return request
  })

  return axiosInstance
}
