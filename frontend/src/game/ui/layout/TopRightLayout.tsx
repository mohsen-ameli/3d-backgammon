import ChatButton from "../components/ChatButton"
import LayoutBtn from "../components/LayoutBtn"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFlag } from "@fortawesome/free-regular-svg-icons"
import { useGameStore } from "@/game/store/useGameStore"
import notification from "@/components/utils/Notification"
import { useRouter } from "next/navigation"
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons"

/**
 * Set of buttons on the top right corner
 */
export default function TopRightLayout() {
  const inGame = useGameStore(state => state.inGame)
  const gameMode = useGameStore(state => state.gameMode)

  const router = useRouter()

  function exitGame() {
    const msg = "Are you sure you want to leave? You will lose the current game!"
    notification(msg, "accept-reject", false, () => router.push("/"))
  }

  function resignMe() {
    const players = useGameStore.getState().players
    const resign = useGameStore.getState().resign

    if (players) resign(players.enemy.id, players.me.id)
  }

  if (!inGame) return <></>

  return (
    <div className="absolute right-8 top-0 z-[17] flex items-center justify-center gap-x-1 p-1 lg:right-0 lg:gap-x-2 lg:p-2">
      {gameMode !== "pass-and-play" && <ChatButton />}

      {gameMode === "pass-and-play" ? (
        <div onClick={exitGame}>
          <LayoutBtn title="Exit">
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </LayoutBtn>
        </div>
      ) : (
        <LayoutBtn title="Resign" onClick={resignMe}>
          <FontAwesomeIcon icon={faFlag} className="rotate-[-20deg]" />
        </LayoutBtn>
      )}
    </div>
  )
}
