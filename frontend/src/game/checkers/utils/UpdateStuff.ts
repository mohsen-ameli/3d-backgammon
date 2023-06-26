import { useGameStore } from "@/game/store/useGameStore"
import hasMoves from "@/game/utils/HasMoves"
import switchPlayers from "@/game/utils/SwitchPlayers"
import updateLiveGame from "@/game/utils/updateLiveGame"

/**
 * Update states and backend
 */
export default function updateStuff(moved: number, setShow: React.Dispatch<React.SetStateAction<boolean>>) {
  const dice = useGameStore.getState().dice
  const ws = useGameStore.getState().ws

  // Updating the dice
  const newDice = dice
  newDice.moves--
  if (newDice.moves < 2) {
    if (newDice.dice1 === moved) newDice.dice1 = 0
    else newDice.dice2 = 0
  }

  useGameStore.setState({ dice: newDice })

  // Check if user has any valid moves
  const moves = hasMoves()

  // If the user has no valid moves
  if (!moves) {
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
    useGameStore.setState(state => ({ userChecker: switchPlayers(state.userChecker!) }))
    !ws && useGameStore.setState({ phase: "diceRoll" })
  } else {
    // Making sure there's a rerender every time the user moves
    // We have to make sure that user is not playing a live game
    // since in a live game, this exact same code gets run (check
    // useEffect with ws dependency in Game)

    if (!ws) {
      useGameStore.setState(state => ({
        phase: state.phase === "checkerMove" ? "checkerMoveAgain" : "checkerMove",
      }))
    }
  }

  // Updating the backend
  ws && updateLiveGame()
}
