import gsap from "gsap"
import { useContext, useEffect, useRef, useState } from "react"
import useFetch from "../../../components/hooks/useFetch"
import { GameContext } from "../../context/GameContext"
import { MessageType } from "../../types/Message.type"
import LayoutBtn from "./LayoutBtn"

/**
 * In-game messaging system, where we fetch the available messages from the backend,
 * and show them to the user. When the user clicks on one, a message is sent to
 * the backend, and back to both to users, to show the message.
 */
const ChatButton = () => {
  const { ws, players } = useContext(GameContext)

  const { data } = useFetch("/api/game/get-in-game-messages/")
  const messages: MessageType[] = data

  const [showChat, setShowChat] = useState(false)
  const initialRender = useRef(true)

  const toggleChat = () => setShowChat(curr => !curr)

  // Sending a message to the other user
  const sendMessage = (msg: MessageType) => {
    if (!players) return

    setShowChat(false)
    ws?.send(
      JSON.stringify({
        user_id: players.me.id,
        message: msg,
      })
    )
  }

  // Handling sowing the chat
  const chat = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (showChat)
      gsap.fromTo(
        chat.current,
        { scaleY: 0 },
        { scaleY: 1, opacity: 1, display: "block" }
      )
    else if (!initialRender.current)
      gsap.fromTo(
        chat.current,
        { scaleY: 1 },
        { scaleY: 0, opacity: 0, display: "none" }
      )
    else gsap.to(chat.current, { opacity: 0, display: "none" })

    initialRender.current = false
  }, [showChat])

  return (
    <div className="z-[15]">
      <LayoutBtn title="Chat" onClick={toggleChat}>
        <i className="fa-regular fa-comments mr-1"></i>
        <i
          className={
            "fa-solid fa-caret-down duration-500 ease-in-out " +
            (showChat ? "rotate-180" : "rotate-0")
          }
        />
      </LayoutBtn>

      <div className="absolute left-0">
        <div
          ref={chat}
          className="custom-scroll-bar absolute -left-16 top-2 h-[200px] w-[150px] origin-top rounded-lg bg-slate-400"
        >
          {messages?.map(msg => (
            <div
              className="cursor-pointer border-b-2 px-2 py-2 duration-100 hover:bg-sky-700 hover:ease-in-out"
              key={msg.id}
              onClick={() => sendMessage(msg)}
            >
              {msg.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChatButton
