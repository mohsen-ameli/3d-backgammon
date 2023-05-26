import { RigidBodyApi } from "@react-three/rapier"
import axios from "axios"
import { Euler } from "three"
import getServerUrl from "../../../components/utils/getServerUrl"

/**
 * Deprecated hook. This component returns a function that takes in a rigid body die instance,
 * and converts the die's rotation to euler, and uses it to get a prediction from the
 * AI that's served in the backend. This component is the successor to the old one,
 * which used pure math to do this. This is a total overkill, but IT WORKS.
 * @deprecated
 */
const useGetDiceNumberAI = () => {
  const predict = async (die: RigidBodyApi) => {
    const euler = new Euler()
    euler.setFromQuaternion(die.rotation())

    const context = {
      x: euler.x,
      y: euler.y,
      z: euler.z,
    }

    const res = await axios.post(
      `${getServerUrl()}/api/ai/dice/predict/`,
      context
    )
    const prediction: number = res.data.prediction
    return prediction
  }

  return predict
}

export default useGetDiceNumberAI
