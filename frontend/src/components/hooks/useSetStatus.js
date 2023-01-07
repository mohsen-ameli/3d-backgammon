import useAzios from "./useAzios"

const useSetStatus = () => {
  const aziosInstance = useAzios()

  // Change the user's status
  const changeStatus = async (status) => {
    try {
      console.log("status = ", status)
      await aziosInstance.put("api/change-user-status/", { status })
    } catch (error) {
      console.log("setStatus error = ", error)
    }
  }

  return { changeStatus }
}

export default useSetStatus
