import { useContext } from "react"
import { GameContext } from "../context/GameContext"
import { USER_TURN_DURATION } from "../data/Data"

// Updating backend live game
const useUpdateLiveGame = () => {
  const { dice, userChecker, players, checkers, ws } = useContext(GameContext)

  const updateLiveGame = () => {
    let player_timer = null

    // Update the game's timer
    if (dice.current.moves === 0) {
      // Use the update method in checker and dices, to send an update to the backend. in the backend make player_timer an optional field
      let id
      if (userChecker.current === players.current.me.color)
        id = players.current.me.id
      else id = players.current.enemy.id

      player_timer = {
        id,
        time: Date.now() + USER_TURN_DURATION * 1000,
      }
    }

    const context = {
      update: true,
      board: checkers.current,
      dice: dice.current,
      turn: userChecker.current,
      player_timer,
    }
    ws?.send(JSON.stringify(context))
  }

  return { updateLiveGame }
}

export default useUpdateLiveGame
