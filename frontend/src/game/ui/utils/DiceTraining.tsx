// import { useContext, useRef, useState } from "react"
// import useAxios from "../../../components/hooks/useAxios"
// import Button from "../../../components/ui/Button"
// import Input from "../../../components/ui/Input"
// import notification from "../../../components/utils/Notification"
// import { GameContext } from "../../context/GameContext"

// /**
//  * Deprecated function. Used this for training the AI I built to determine dice
//  * numbers based on the die's rotation.
//  * @deprecated
//  */
// const DiceTraining = () => {
//   const { throwDice } = useContext(GameContext)
//   // const { run } = useDiceRotationAI()
//   const inputRef = useRef<HTMLInputElement>(null)

//   const axiosInstance = useAxios()

//   const [prediction, setPrediction] = useState(0)

//   // prettier-ignore
//   const predict = async () => {
//     // Getting the dice's x, y, z rotation value, that got saved when we threw the dice in Dice.tsx
//     let dicePhysics = localStorage.getItem("dicePhysics")
//     if (!dicePhysics) return
//     dicePhysics = JSON.parse(dicePhysics)

//     await axiosInstance.post("/api/ai/dice/predict/", dicePhysics)
//   }

//   const save = () => {
//     // Getting the dice's x, y, z rotation value, that got saved when we threw the dice in Dice.tsx
//     const dicePhysics = localStorage.getItem("dicePhysics")
//     if (!dicePhysics || !inputRef.current) return

//     // Input and output to be saved to the trainingData
//     const input = JSON.parse(dicePhysics)

//     // @ts-ignore
//     if (isNaN(inputRef.current.value)) {
//       notification("Enter a valid number between 1-6")
//       inputRef.current.value = ""
//       return
//     }

//     // Send a call to save the new data to the backend
//     const output = [Number(inputRef.current?.value)]
//     if (output[0] > 6 || output[0] < 1) {
//       notification("Enter a valid number between 1-6")
//       inputRef.current.value = ""
//       return
//     }
//     inputRef.current.value = ""

//     const newTrainingData = { input, output }
//     axiosInstance.post("/api/ai/dice/", newTrainingData)
//   }

//   return (
//     <div className="absolute left-1/2 top-0 z-10 flex h-[60px] w-fit -translate-x-1/2 gap-4 rounded-md bg-blue-400 p-2">
//       <Input className="w-[120px]" placeholder="Dice number" ref={inputRef} />
//       <Button onClick={() => throwDice.current()}>Throw</Button>
//       <Button onClick={save}>Save</Button>
//       <Button onClick={predict}>Predict</Button>
//       prediction: {prediction}
//     </div>
//   )
// }

// export default DiceTraining
