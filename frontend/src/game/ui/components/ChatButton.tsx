"use client"

import gsap from "gsap"
import { useEffect, useRef, useState } from "react"
import { MessageType } from "../../types/Message.type"
import LayoutBtn from "./LayoutBtn"
import { getSession } from "next-auth/react"
import AxiosInstance from "@/components/utils/AxiosInstance"
import { faComments } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useGameStore } from "@/game/store/useGameStore"
import { faCaretDown } from "@fortawesome/free-solid-svg-icons"

/**
 * In-game messaging system, where we fetch the available messages from the backend,
 * and show them to the user. When the user clicks on one, a message is sent to
 * the backend, and back to both to users, to show the message.
 */
export default function ChatButton() {
  const [messages, setMessages] = useState<MessageType[] | null>(null)
  
  async function fetchStuff() {
    const session = await getSession()
    const axiosInstance = AxiosInstance(session!)
    const { data }: { data: MessageType[] } = await axiosInstance.get("/api/game/get-in-game-messages/")
    setMessages(data)
  }

  useEffect(() => {
    fetchStuff()
  }, [])

  const [showChat, setShowChat] = useState(false)
  const initialRender = useRef(true)

  const toggleChat = () => setShowChat(curr => !curr)

  // Sending a message to the other user
  function sendMessage(msg: MessageType) {
    const players = useGameStore.getState().players
    if (!players) return

    const ws = useGameStore.getState().ws

    setShowChat(false)

    ws?.send(
      JSON.stringify({
        id: players.me.id,
        message: msg,
      }),
    )
  }

  // Handling sowing the chat
  const chat = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (showChat) gsap.fromTo(chat.current, { scaleY: 0 }, { scaleY: 1, opacity: 1, display: "block" })
    else if (!initialRender.current)
      gsap.fromTo(chat.current, { scaleY: 1 }, { scaleY: 0, opacity: 0, display: "none" })
    else gsap.to(chat.current, { opacity: 0, display: "none" })

    initialRender.current = false
  }, [showChat])

  return (
    <div className="z-[15]">
      <LayoutBtn title="Chat" onClick={toggleChat}>
        <FontAwesomeIcon icon={faComments} className="mr-1" />
        <FontAwesomeIcon
          icon={faCaretDown}
          className={"duration-500 ease-in-out " + (showChat ? "rotate-180" : "rotate-0")}
        />
      </LayoutBtn>

      <div className="absolute left-0">
        <div
          ref={chat}
          className="custom-scroll-bar absolute -left-16 top-2 h-[200px] w-[150px] origin-top rounded-lg bg-slate-400"
        >
          {messages?.map(msg => (
            <div
              className="cursor-pointer border-b-2 p-2 duration-100 hover:bg-sky-700 hover:ease-in-out"
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
