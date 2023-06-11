import { motion } from "framer-motion"
import Button from "../../../components/ui/Button"
import { faDice } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useGameStore } from "@/game/store/useGameStore"
import { shallow } from "zustand/shallow"

/**
 * Shows the throw button, if it's supposed to (based on the state).
 */
export default function ThrowButton({ className }: { className?: string }) {
  const showThrow = useGameStore(state => state.showThrow)
  const dice = useGameStore(state => state.dice, shallow)

  function handleClick() {
    useGameStore.getState().throwDice?.()
  }

  return (
    <div className={"w-full text-sm lg:text-lg " + className}>
      {showThrow ? (
        <motion.div
          className="flex w-full justify-center"
          initial={{ scale: 1 }}
          animate={{ scale: 1.16 }}
          exit={{ scale: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1,
          }}
        >
          <Button filled title="Throw Dice" className="inset-0 w-[90%] px-0 hover:animate-none" onClick={handleClick}>
            Throw <FontAwesomeIcon icon={faDice} />
          </Button>
        </motion.div>
      ) : showThrow === false ? (
        <h1 className="cursor-default text-center">Loading dice...</h1>
      ) : (
        dice?.moves === 0 && <h1 className="cursor-default text-center">Throwing dice...</h1>
      )}
    </div>
  )
}
