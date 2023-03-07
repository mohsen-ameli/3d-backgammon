import { useContext } from "react"
import Button from "../../components/ui/Button"
import { GameContext } from "../context/GameContext"

type ThrowButtonProps = {
  className?: string
}

/**
 * Shows the throw button, if it's supposed to (based on the state).
 */
const ThrowButton = ({ className }: ThrowButtonProps) => {
  const { throwDice, showThrow } = useContext(GameContext)

  return (
    <div className={"w-full text-sm text-white lg:text-lg " + className}>
      {showThrow ? (
        <Button
          title="Throw Dice"
          className="w-full lg:h-10 lg:w-full lg:px-4"
          onClick={() => throwDice.current()}
        >
          Throw <i className="fa-solid fa-dice"></i>
        </Button>
      ) : (
        showThrow === false && (
          <Button className="cursor-default">Loading dice...</Button>
        )
      )}
    </div>
  )
}

export default ThrowButton
