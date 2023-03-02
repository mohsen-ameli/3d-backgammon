import { useState } from "react"
import Button from "../../components/ui/Button"
import { ToggleZoomType } from "../types/Game.type"
import { MessgaeType } from "../types/Message.type"

type InGameChatProps = {
  ws: WebSocket
  toggleZoom: ToggleZoomType
  messages: MessgaeType[]
  user: string
}

/**
 * In game chat system, where we fetch the available messages from the backend,
 * and show them to the user. When the user clicks on one, a message is sent to
 * the backend, and back to both to users, to show the message, which is a
 * notification for now.
 */
const InGameChat = ({ ws, toggleZoom, messages, user }: InGameChatProps) => {
  const [showChat, setShowChat] = useState(false)

  // Sending a message to the other user
  const sendMessage = (message: string) => {
    setShowChat(false)
    toggleZoom(true)

    ws?.send(
      JSON.stringify({
        user,
        message,
      })
    )
  }

  const toggleChat = () => setShowChat(curr => !curr)

  return (
    <div className="relative">
      <Button className="w-full text-white" onClick={toggleChat}>
        <i className="fa-regular fa-comments" /> Chat{" "}
        <i
          className={
            "fa-solid fa-caret-down duration-500 ease-in-out " +
            (showChat ? "rotate-180" : "rotate-0")
          }
        />
      </Button>

      {showChat && (
        <div className="custom-scroll-bar absolute top-12 h-[200px] rounded-lg bg-slate-400">
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
  )
}

export default InGameChat
