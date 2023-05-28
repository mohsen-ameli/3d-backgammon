import axios, { AxiosInstance } from "axios"
import getServerUrl from "./getServerUrl"
import getJWTToken from "./getJWTToken"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

/**
 * Hook used for all types of http requests.
 * @returns Axios instance with correct url and authorization
 */
export default function useAxios() {
  const { data: session } = useSession()

  const [axiosInstance, setAxiosInstance] = useState<AxiosInstance | null>(null)

  useEffect(() => {
    if (!session) return

    setAxiosInstance(axios.create())
  }, [session])

  useEffect(() => {
    if (!axiosInstance || !session) return
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
  }, [axiosInstance])

  return axiosInstance
}
