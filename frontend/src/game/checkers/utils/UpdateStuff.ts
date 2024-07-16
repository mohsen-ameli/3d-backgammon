import { useGameStore } from "@/game/store/useGameStore"
import hasMoves from "@/game/utils/HasMoves"
import switchPlayers from "@/game/utils/SwitchPlayers"
import updateLiveGame from "@/game/utils/updateLiveGame"

/**
 * Updates the dice, the user checker (switches users if need be), phase,
 * and the backend if there's a live game.
 *
 * @param moved The number of columns that a checker moved
 * @param setShow A function to set the show state of the message "user has no valid moves"
 * @param forceUpdate Whether to force a rerender or not
 */
export default function updateStuff(
  moved: number,
  setShow: React.Dispatch<React.SetStateAction<boolean>>,
  forceUpdate: boolean = true,
) {
  const { ws, dice } = useGameStore.getState()

  // Updating the dice
  const newDice = dice
  newDice.moves--
  if (newDice.moves < 2) {
    if (newDice.dice1 === moved) newDice.dice1 = 0
    else newDice.dice2 = 0
  }

  useGameStore.setState({ dice: newDice })

  // If the user has no valid moves
  if (!hasMoves()) {
    useGameStore.setState(state => ({
      userChecker: switchPlayers(state.userChecker!),
      dice: { dice1: 0, dice2: 0, moves: 0 },
    }))

    // Set the phase to diceRoll
    if (!ws) useGameStore.setState({ phase: "diceRoll" })
    else updateLiveGame()

    // Show a message that the user has no valid moves
    setShow(true)
    return
  }

  // Updating the user that is playing, and the phase
  if (newDice.moves === 0) {
    useGameStore.setState(state => ({
      userChecker: switchPlayers(state.userChecker!),
    }))
    !ws && useGameStore.setState({ phase: "diceRoll" })
  } else {
    // Making sure there's a rerender every time the user moves
    // We have to make sure that user is not playing a live game
    // since in a live game, this exact same code gets run (check
    // useEffect with ws dependency in Game)

    if (!ws && forceUpdate) {
      useGameStore.setState(state => ({
        phase: state.phase === "checkerMove" ? "checkerMoveAgain" : "checkerMove",
      }))
    }
  }

  // Updating the backend
  ws && updateLiveGame()
}
