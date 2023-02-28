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

const InGameChat = ({ ws, toggleZoom, messages, user }: InGameChatProps) => {
  const [showChat, setShowChat] = useState(false)

  // Sending a message to the other user
  const sendMessage = (message: string) => {
    setShowChat(false)
    toggleZoom(true)

    ws &&
      ws.send(
        JSON.stringify({
          user,
          message,
        })
      )
  }

  return (
    <div className="relative select-none">
      <Button
        className="w-full text-white"
        onClick={() => setShowChat((curr) => !curr)}
      >
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
          {messages.map((msg) => (
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