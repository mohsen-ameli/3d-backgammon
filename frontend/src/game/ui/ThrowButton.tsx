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
  const { throwDice, showThrow, dice } = useContext(GameContext)

  return (
    <div className={"w-full text-sm lg:text-lg " + className}>
      {showThrow ? (
        <Button
          title="Throw Dice"
          className="inset-0 w-full animate-pulse px-0 hover:animate-none"
          onClick={() => throwDice.current()}
        >
          Throw <i className="fa-solid fa-dice"></i>
        </Button>
      ) : showThrow === false ? (
        <h1 className="cursor-default text-center">Loading dice...</h1>
      ) : (
        dice.current.moves === 0 && (
          <h1 className="cursor-default text-center">Throwing dice...</h1>
        )
      )}
    </div>
  )
}

export default ThrowButton
