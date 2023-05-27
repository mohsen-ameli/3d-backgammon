import wsGood from "@/components/utils/wsGood"
import { USER_TURN_DURATION } from "../data/Data"
import { useGameStore } from "../store/useGameStore"

// Updating backend live game
export default function updateLiveGame() {
  const { dice, userChecker, players, checkers, ws } = useGameStore.getState()

  if (!players) return
  let player_timer = null

  // Update the game's timer
  if (dice.moves === 0) {
    // Use the update method in checker and dice, to send an update to the backend. in the backend make player_timer an optional field
    let id
    if (userChecker === players.me.color) id = players.me.id
    else id = players.enemy.id

    player_timer = {
      id,
      time: Date.now() + USER_TURN_DURATION * 1000,
    }
  }

  const context = {
    update: true,
    board: checkers,
    dice: dice,
    turn: userChecker,
    player_timer,
  }

  if (ws && wsGood(ws)) ws.send(JSON.stringify(context))
}
