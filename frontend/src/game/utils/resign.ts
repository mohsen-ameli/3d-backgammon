import notification from "@/components/utils/Notification"
import { useGameStore } from "../store/useGameStore"

export default function resign(winnerId: number, loserId: number, send: boolean = false) {
  const ws = useGameStore.getState().ws

  const context = JSON.stringify({
    resign: true,
    winner: winnerId,
    resigner: loserId,
  })

  if (send) {
    ws?.send(context)
    return
  }

  const msg = "Confirm resignation?"
  notification(msg, "accept-reject", false, () => ws?.send(context), undefined)
}
