import { Html } from "@react-three/drei"
import { useContext } from "react"
import Button from "../components/ui/Button"
import { GameState } from "./Game"

const UI = () => {
  const { userTurn } = useContext(GameState)

  return (
    <Html as="div" transform scale={0.2} position={[1.75, 1, 0]} sprite>
      {/* Flipping the board */}
      {/* <Button
        className="text-white select-none"
        onClick={() => {
          userTurn.current = userTurn.current === "white" ? "black" : "white"
          // Fire a function to flip the board
          // board.current.rotation.y = board.current.rotation.y + Math.PI
        }}
      >
        Flip the board
      </Button> */}
    </Html>
  )
}

export default UI
