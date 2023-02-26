import { useContext, useEffect, useRef, useState } from "react"
import { useLocation, useNavigate, Navigate } from "react-router-dom"
import Button from "../../../components/ui/Button"
import Container from "../../../components/ui/Container"
import Input from "../../../components/ui/Input"
import Header from "../../../components/ui/Header"
import { AuthContext } from "../../../context/AuthContext"
import Loading from "../../../components/ui/Loading"
import getServerUrl from "../../../components/utils/getServerUrl"
import MessageBox from "./MessageBox"
import Status from "./Status"

type MessageType = {
  timestamp: number
  sender: number
  message: string
}[]

/**
 * This chat componenet is used to display the chat between the user and a friend.
 * It uses the state passed down to it from FriendDetails component.
 */
const Chat = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  // User has tried to enter the chat room manually. that's a nono
  if (!location.state) {
    return <Navigate to="/friends" replace />
  }

  const messageInput = useRef<HTMLInputElement>({} as HTMLInputElement)
  const chatContainer = useRef<HTMLDivElement>({} as HTMLDivElement)

  const [messages, setMessages] = useState<MessageType>([])
  const [loading, setLoading] = useState(true)

  // Create WebSocket connection.
  const [ws] = useState(() => new WebSocket(`${getServerUrl(false)}/ws/chat/${location.state.uuid}/`)) // prettier-ignore

  // When oppening the connection initialy, send a command to fetch all messages
  const onOpen = () => {
    ws.send(JSON.stringify({ command: "fetch_messages" }))
    setLoading(false)
  }

  // Listen for messages from server
  const onMessage = (e: MessageEvent) => {
    const data = JSON.parse(e.data)
    setMessages((old) => [...old, ...data])
    setTimeout(() => {
      chatContainer.current.scrollTop = 1000000
    }, 50)
    setLoading(false)
  }

  useEffect(() => {
    ws.onopen = onOpen
    ws.onmessage = onMessage

    return () => {
      ws.close()
      navigate("/friends")
    }
  }, [ws])

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()

    const target = e.target as typeof e.target & {
      text: { value: string }
    }

    const message = target.text.value
    if (message === "") return

    // Send message to server
    ws.send(
      JSON.stringify({
        message,
        sender: user?.user_id,
        timestamp: Math.floor(Date.now() / 1000),
      })
    )

    // Scroll to bottom
    setTimeout(() => {
      chatContainer.current.scrollTop = 1000000
    }, 10)

    // Clear input
    messageInput.current.value = ""
  }

  return (
    <Container className="select-none">
      <Header to="/" title={location.state.friend}>
        <Status />
      </Header>

      {/* Actuall chat messgaes */}
      {loading ? (
        <Loading />
      ) : (
        // Messages
        <div className="custom-scroll-bar mb-14" ref={chatContainer}>
          {messages.length > 0 ? (
            messages.map((msg, index) => {
              const f = new Intl.DateTimeFormat("default", {
                hour: "numeric",
                hour12: true,
                minute: "numeric",
              })

              const date = f.format(new Date(msg.timestamp * 1000))

              return (
                <MessageBox
                  key={index}
                  type={msg.sender === user?.user_id ? "user" : "friend"}
                  message={msg.message}
                  date={date}
                />
              )
            })
          ) : (
            <EmptyChat />
          )}
        </div>
      )}

      {/* The input form */}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 flex w-full gap-x-2 p-3"
        autoComplete="off"
      >
        <Input
          className="w-full"
          type="text"
          name="text"
          placeholder="Type a message..."
          autoComplete="off"
          maxLength={200}
          ref={messageInput}
        />

        <Button className="w-fit">
          <i className="fa-solid fa-paper-plane"></i>
        </Button>
      </form>
    </Container>
  )
}

const EmptyChat = () => {
  return (
    <p className="mt-1 text-center text-xl font-semibold">
      Wow this is an empty chat...
    </p>
  )
}

export default Chat
