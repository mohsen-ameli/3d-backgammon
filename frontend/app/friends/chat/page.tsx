"use client"

import { useEffect, useRef, useState } from "react"
import MessageBox from "./MessageBox"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import Header from "@/components/ui/Header"
import Loading from "@/components/ui/Loading"
import { useSession } from "next-auth/react"
import getServerUrl from "@/components/utils/getServerUrl"
import { redirect } from "next/navigation"
import AxiosInstance from "@/components/utils/AxiosInstance"
import notification from "@/components/utils/Notification"
import wsGood from "@/components/utils/wsGood"
import { useFriendStore } from "@/store/useFriendStore"
import getStatus from "./Status"
import Head from "@/components/head"

type MessageType = {
  timestamp: number
  sender: string
  message: string
}[]

/**
 * This chat component is used to display the chat between the user and a friend.
 * It uses the state passed down to it from FriendDetails component.
 */
export default function Chat() {
  const friend = useFriendStore.getState().friend

  const { data: session } = useSession()

  const axiosInstance = AxiosInstance(session!)

  const metadata = {
    title: `3D Backgammon | ${session?.user.name} • ${friend?.username}`,
    description: `The legendary chat between ${session?.user.name} and ${friend?.username}.`,
  }

  const messageInput = useRef<HTMLInputElement>({} as HTMLInputElement)
  const chatContainer = useRef<HTMLDivElement>({} as HTMLDivElement)

  const [data, setData] = useState<MessageType>([])
  const [ws, setWs] = useState<WebSocket | null>(null)

  // Setting the websocket connection
  useEffect(() => {
    async function validateChat() {
      type Data = { data: { valid: boolean } }

      const { data }: Data = await axiosInstance.get(`/api/validate-chat/${uuid}/`)

      if (!data.valid) {
        notification("Wrong chat 1!")
        redirect("/friends")
      }
    }

    const uuid = useFriendStore.getState().uuid

    if (!uuid) {
      notification("Wrong chat 2!")
      redirect("/friends")
    }

    if (!session || ws) return
    else validateChat()

    const url = `${getServerUrl(false)}/ws/chat/${uuid}/`
    setWs(new WebSocket(url))
  }, [session, ws, axiosInstance])

  // Web Socket listeners
  useEffect(() => {
    if (!ws) return

    ws.addEventListener("message", onMessage)

    return () => {
      ws.removeEventListener("message", onMessage)

      if (wsGood(ws)) {
        ws.close()
        redirect("/friends")
      }
    }
  }, [ws])

  function onMessage(e: MessageEvent) {
    const data: MessageType = JSON.parse(e.data)

    setData(old => (old ? [...old, ...data] : data))
    setTimeout(() => {
      chatContainer.current.scrollTop = 1000000
    }, 50)
  }

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()

    const target = e.target as typeof e.target & {
      text: { value: string }
    }

    const message = target.text.value
    if (message === "") return

    // Send message to server
    ws?.send(
      JSON.stringify({
        message,
        sender: session?.user.id,
        timestamp: Math.floor(Date.now() / 1000),
      }),
    )

    // Scroll to bottom
    setTimeout(() => {
      chatContainer.current.scrollTop = 1000000
    }, 10)

    // Clear input
    messageInput.current.value = ""
  }

  function getDate(date: number) {
    const f = new Intl.DateTimeFormat("default", {
      hour: "numeric",
      hour12: true,
      minute: "numeric",
    })

    return f.format(new Date(date * 1000))
  }

  if (!data || !friend) return <Loading basic center />

  return (
    <>
      <Head description={metadata.description} title={metadata.title} />

      <Header href="/friends" title={friend.username}>
        <p className="text-center text-xs text-slate-800">{getStatus(friend)}</p>
      </Header>

      {/* Messages */}
      <div className="custom-scroll-bar mb-14" ref={chatContainer}>
        {data.length > 0 ? (
          data.map((msg, index) => (
            <MessageBox
              key={index}
              type={msg.sender === session?.user.id ? "user" : "friend"}
              message={msg.message}
              date={getDate(msg.timestamp)}
            />
          ))
        ) : (
          <p className="mt-1 text-center text-xl font-semibold">Wow this is an empty chat...</p>
        )}
      </div>

      {/* The input form */}
      <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 flex w-full gap-x-2 p-3" autoComplete="off">
        <Input
          className="w-full"
          type="text"
          name="text"
          placeholder="Type a message..."
          autoComplete="off"
          maxLength={200}
          ref={messageInput}
        />
        <Button>
          <FontAwesomeIcon icon={faPaperPlane} />
        </Button>
      </form>
    </>
  )
}
