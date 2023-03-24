import { RigidBodyApi } from "@react-three/rapier"
import { Euler } from "three"
import useAxios from "../../components/hooks/useAxios"

const useGetDiceNumberAI = () => {
  const axiosInstance = useAxios()

  const predict = async (die: RigidBodyApi) => {
    const euler = new Euler()
    euler.setFromQuaternion(die.rotation())

    const context = {
      x: euler.x,
      y: euler.y,
      z: euler.z,
    }

    const res = await axiosInstance.post("/api/ai/dice/predict/", context)
    const prediction: number = res.data.prediction
    return prediction
  }

  return predict
}

export default useGetDiceNumberAI
