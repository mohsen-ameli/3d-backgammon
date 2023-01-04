import { useEffect, useState } from "react"
import useAxios from "./useAxios"

/**
 * Hook used for GET requests
 * @param url -> URL to fetch data from
 * @returns -> the data, loading state, error messages, and a function to re-fetch the data
 */

const useFetch = (url) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const axiosInstance = useAxios()

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(url)

      if (response.status === 200) {
        setData(response.data)
      }
    } catch (error) {
      setError(
        error.response?.data.message ? error.response.data.message : error
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line
  }, [url])

  return { data, loading, error, fetchData }
}

export default useFetch
