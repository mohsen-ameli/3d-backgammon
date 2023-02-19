import { useThree } from "@react-three/fiber"
import { useEffect } from "react"
import notification from "../components/utils/Notification"

const ViewPort = () => {
  const { size } = useThree()
  const aspect = size.width / size.height

  useEffect(() => {
    if (aspect < 1.6) {
      notification(
        "Please consider switching to horizontal view for a better experience!",
        "info"
      )
    }
  }, [])

  return null
}

export default ViewPort
