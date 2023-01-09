import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { useLocation, useNavigate, useParams, Navigate } from "react-router-dom"
import Button from "../../components/ui/Button"
import Container from "../../components/ui/Container"
import Input from "../../components/ui/Input"
import Header from "../../components/ui/Header"
import { AuthContext } from "../../context/AuthContext"

const Chat = () => {
  const [messages, setMessages] = useState([])
  const messageInput = useRef()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useContext(AuthContext)
  const chatContainer = useRef()

  // Create WebSocket connection.
  const [ws] = useState(
    () => new WebSocket(`ws://localhost:8000/ws/chat/${location.state.uuid}/`)
  )

  useEffect(() => {
    ws.onopen = () => {
      console.log("Connected to server!@#")
      ws.send(JSON.stringify({ command: "fetch_messages" }))
    }
    ws.onclose = () => console.log("closed")

    // Listen for messages from server
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setMessages((old) => [...old, data])
      setTimeout(() => {
        chatContainer.current.scrollTop = 1000000
      }, 50)
    }

    return () => {
      ws.close()
      navigate("/friends")
    }
  }, [ws])

  const handleSubmit = (e) => {
    e.preventDefault()
    const message = e.target.text.value
    if (message === "") return

    // Send message to server
    ws.send(
      JSON.stringify({
        message,
        sender: user.user_id,
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

  // if (!location.state) {
  //   return <Navigate to="/friends" replace />
  // }

  return (
    <Container className="select-none">
      <Header to="/" title={location.state.friend}>
        <p className="text-xs text-slate-500 text-center">
          {location.state.status ? "Online" : "Offline"}
        </p>
      </Header>

      <div className="mb-14 custom-scroll-bar" ref={chatContainer}>
        {messages.map((msg, index) => {
          // prettier-ignore
          const f = new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            hour12: true,
            minute: "numeric",
          })

          let date = new Date(msg.timestamp * 1000)
          date = f.format(date)

          if (msg.sender === user.user_id) {
            // User messages
            // prettier-ignore
            return <MessageBox key={index} type="user" sender="You" message={msg.message} date={date} />
          }
          // Friend message
          // prettier-ignore
          return <MessageBox key={index} type="friend" sender={location.state.friend} message={msg.message} date={date} />
        })}
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full fixed bottom-0 left-0 p-3 flex gap-x-2"
        autoComplete="off"
      >
        <Input
          type="text"
          name="text"
          placeholder="Type a message..."
          autoComplete="off"
          ref={messageInput}
          className="w-full"
        />

        <Button>
          <i className="fa-solid fa-paper-plane"></i>
        </Button>
      </form>
    </Container>
  )
}

const MessageBox = ({ type, message, sender, date }) => {
  return (
    <div
      // prettier-ignore
      className={
        "w-fit max-w-[320px] flex items-center justify-between gap-x-2 p-2 mb-2 rounded-md " +
        (type === "friend" ? "bg-slate-200 mr-auto" : "bg-orange-200 mr-2 ml-auto")
      }
    >
      <p className="text-lg">{message}</p>
      <p className="text-xs text-slate-500">
        {sender} at {date}
      </p>
    </div>
  )
}

export default Chat
