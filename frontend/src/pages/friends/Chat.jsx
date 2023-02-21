import { useContext, useEffect, useRef, useState } from "react"
import { useLocation, useNavigate, Navigate } from "react-router-dom"
import Button from "../../components/ui/Button"
import Container from "../../components/ui/Container"
import Input from "../../components/ui/Input"
import Header from "../../components/ui/Header"
import { AuthContext } from "../../context/AuthContext"
import Loading from "../../components/ui/Loading"
import getServerUrl from "../../components/utils/getServerUrl"

/**
 * This chat componenet is used to display the chat between the user and a friend.
 * It uses the state passed down to it from FriendDetails component.
 */
const Chat = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const messageInput = useRef()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useContext(AuthContext)
  const chatContainer = useRef()

  // Create WebSocket connection.
  const [ws] = useState(
    () =>
      new WebSocket(`${getServerUrl(false)}/ws/chat/${location.state.uuid}/`)
  )

  useEffect(() => {
    ws.onopen = () => {
      ws.send(JSON.stringify({ command: "fetch_messages" }))
      setLoading(false)
    }

    // Listen for messages from server
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setMessages((old) => [...old, ...data])
      setTimeout(() => {
        chatContainer.current.scrollTop = 1000000
      }, 50)
      setLoading(false)
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

  if (!location.state) {
    return <Navigate to="/friends" replace />
  }

  return (
    <Container className="select-none">
      <Header to="/" title={location.state.friend}>
        <Status />
      </Header>

      {loading ? (
        <Loading />
      ) : (
        // Messages
        <div className="mb-14 custom-scroll-bar" ref={chatContainer}>
          {messages && messages.length > 0 ? (
            messages.map((msg, index) => {
              const f = new Intl.DateTimeFormat("default", {
                hour: "numeric",
                hour12: true,
                minute: "numeric",
              })

              let date = new Date(msg.timestamp * 1000)
              date = f.format(date)

              if (msg.sender === user.user_id) {
                // User messages
                return (
                  <MessageBox
                    key={index}
                    type="user"
                    sender="You"
                    message={msg.message}
                    date={date}
                  />
                )
              } else {
                // Friend message
                return (
                  <MessageBox
                    key={index}
                    type="friend"
                    sender={location.state.friend}
                    message={msg.message}
                    date={date}
                  />
                )
              }
            })
          ) : (
            <p className="text-xl font-semibold text-center mt-1">
              Wow this is an empty chat...
            </p>
          )}
        </div>
      )}

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

        <Button className="w-fit">
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
        "w-fit max-w-[300px] min-w-[150px] h-fit relative flex items-center justify-between gap-x-2 p-2 pb-6 mb-2 rounded-md " +
        (type === "friend" ? "bg-slate-200 mr-auto" : "bg-orange-200 mr-2 ml-auto")
      }
    >
      <p className="text-lg break-all">{message}</p>
      <p className="absolute bottom-0 right-1 text-xs text-slate-500 break-normal">
        {date}
      </p>
    </div>
  )
}

const Status = () => {
  const location = useLocation()
  const [status, setStatus] = useState()

  const getStatus = () => {
    if (location.state.status) {
      setStatus("Online")
      return
    }

    const date = new Date(location.state.lastLogin * 1000)
    const today = new Date()
    let lastSeen = ""

    // Seen within a few years
    if (date.getFullYear() < today.getFullYear()) {
      lastSeen = "a long time ago."
    }
    // Seen within this year
    else if (date.getMonth() < today.getMonth()) {
      lastSeen = "a while ago."
    }
    // Seen within this month
    else if (date.getDate() < today.getDate()) {
      const ago = today.getDate() - date.getDate()
      lastSeen = ago + " days ago."
    }
    // Seen today
    else if (date.getHours() < today.getHours()) {
      const f = new Intl.DateTimeFormat("default", {
        hour: "numeric",
        hour12: true,
        minute: "numeric",
      })
      lastSeen = "today around " + f.format(date)
    }
    // Seen within the last hour
    else {
      const ago = today.getMinutes() - date.getMinutes()
      lastSeen = ago + " minutes ago."
    }

    setStatus("Last seen " + lastSeen)
  }

  useEffect(() => {
    location && getStatus()
  }, [location])

  return <p className="text-xs text-slate-500 text-center">{status}</p>
}

export default Chat
