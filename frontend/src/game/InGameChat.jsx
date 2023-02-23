import { useState } from "react"
import Button from "../components/ui/Button"

const InGameChat = ({ ws, toggleZoom, messages, user }) => {
  const [showChat, setShowChat] = useState(false)

  // Sending a message to the other user
  const sendMessage = (message) => {
    setShowChat(false)
    toggleZoom()

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
        className="text-white"
        onClick={() => setShowChat((curr) => !curr)}
      >
        <i className="fa-regular fa-comments" /> Chat{" "}
        <i
          className={
            "fa-solid fa-caret-down ease-in-out duration-500 " +
            (showChat ? "rotate-180" : "rotate-0")
          }
        />
      </Button>

      {showChat && (
        <div className="absolute top-12 h-[200px] rounded-lg custom-scroll-bar bg-slate-400">
          {messages.map((msg) => (
            <div
              className="border-b-2 py-2 px-2 cursor-pointer hover:bg-sky-700 hover:ease-in-out duration-100"
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
