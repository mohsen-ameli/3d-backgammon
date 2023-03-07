import { useContext, useState } from "react"
import useFetch from "../../components/hooks/useFetch"
import { GameContext } from "../context/GameContext"
import { MessgaeType } from "../types/Message.type"
import LayoutBtn from "./LayoutBtn"

/**
 * In game chat system, where we fetch the available messages from the backend,
 * and show them to the user. When the user clicks on one, a message is sent to
 * the backend, and back to both to users, to show the message, which is a
 * notification for now.
 */
const ChatButton = () => {
  const { ws, players } = useContext(GameContext)
  const [showChat, setShowChat] = useState(false)

  const { data } = useFetch("/api/game/get-in-game-messages/")
  const messages: MessgaeType[] = data

  const toggleChat = () => setShowChat(curr => !curr)

  // Sending a message to the other user
  const sendMessage = (message: string) => {
    setShowChat(false)

    ws?.send(
      JSON.stringify({
        user: players.current.me.name,
        message,
      })
    )
  }

  return (
    <div className="z-[15]">
      <LayoutBtn title="Chat" onClick={toggleChat}>
        <i className="fa-regular fa-comments mr-2"></i>
        <i
          className={
            "fa-solid fa-caret-down duration-500 ease-in-out " +
            (showChat ? "rotate-180" : "rotate-0")
          }
        />
      </LayoutBtn>

      <div className="relative">
        {showChat && (
          <div className="custom-scroll-bar absolute top-2 -left-14 h-[200px] w-[150px] rounded-lg bg-slate-400">
            {messages.map(msg => (
              <div
                className="cursor-pointer border-b-2 py-2 px-2 duration-100 hover:bg-sky-700 hover:ease-in-out"
                key={msg.id}
                onClick={() => sendMessage(msg.message)}
              >
                {msg.message}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatButton
