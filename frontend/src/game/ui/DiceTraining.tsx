import { useContext, useRef, useState } from "react"
import useDiceRotationAI from "../../ai/useDiceRotationAI"
import useAxios from "../../components/hooks/useAxios"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import { GameContext } from "../context/GameContext"

const DiceTraining = () => {
  const { throwDice } = useContext(GameContext)
  const { run } = useDiceRotationAI()
  const [prediction, setPrediction] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const axiosInstance = useAxios()

  // prettier-ignore
  const predict = async () => {
    // Getting the dice's x, y, z rotation value, that got saved when we threw the dice in Dice.tsx
    const dicePhysics = localStorage.getItem("dicePhysics")
    if (!dicePhysics) return

    // Input and output to be saved to the trainingData
    const input = JSON.parse(dicePhysics)
    
    const p = await run(input)
    console.log("input", input)
    console.log("p", p)
    setPrediction(p)
  }

  const save = () => {
    // Getting the dice's x, y, z rotation value, that got saved when we threw the dice in Dice.tsx
    const dicePhysics = localStorage.getItem("dicePhysics")
    if (!dicePhysics) return

    // Input and output to be saved to the trainingData
    const input = JSON.parse(dicePhysics)

    // Send a call to save the new data to the backend
    const output = [Number(inputRef.current?.value)]
    const newTrainingData = { input, output }
    axiosInstance.post("/api/ai/dice/", newTrainingData)
  }

  return (
    <div className="absolute top-0 left-1/2 z-10 flex h-[60px] w-fit -translate-x-1/2 gap-4 rounded-md bg-blue-400 p-2">
      <Input
        className="w-[75px]"
        placeholder="Dice number"
        type="number"
        ref={inputRef}
      />
      <Button onClick={() => throwDice.current()}>Throw</Button>
      <Button onClick={save}>Save</Button>
      <Button onClick={predict}>Predict</Button>
      prediction: {prediction}
    </div>
  )
}

export default DiceTraining
