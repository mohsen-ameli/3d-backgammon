import { useCallback, useEffect, useRef, useState } from "react"
import { useLocation, useNavigate, useParams, Navigate } from "react-router-dom"
import Button from "../../components/ui/Button"
import Container from "../../components/ui/Container"
import Input from "../../components/ui/Input"
import Back from "../../components/ui/Back"
import Title from "../../components/ui/Title"

const Chat = () => {
  const [messages, setMessages] = useState([])
  const messageInput = useRef()
  const uuid = useParams().uuid
  const navigate = useNavigate()
  const location = useLocation()

  // const uuid = crypto.randomUUID()

  // Create WebSocket connection.
  // TODP: probably get the uuid from the url
  const [ws] = useState(
    () => new WebSocket(`ws://localhost:8000/ws/game/${uuid}/`)
  )

  const close = useCallback(() => {
    ws.close()
    navigate("/friends")
  }, [navigate, ws])

  useEffect(() => {
    // Connect to server
    ws.onopen = () => {
      console.log("Connected to server")
    }

    ws.onclose = () => {
      console.log("closed")
    }

    // Listen for messages from server
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setMessages((old) => [...old, data.message])
    }

    return () => {
      close()
    }
  }, [close, ws])

  const handleSubmit = (e) => {
    e.preventDefault()
    const test = e.target.test.value
    if (test === "") return

    // Send message to server
    ws.send(
      JSON.stringify({
        message: test,
      })
    )

    // Clear input
    messageInput.current.value = ""
  }

  if (!location.state) {
    return <Navigate to="/friends" replace />
  }

  return (
    <Container>
      {/* Header section */}
      <div className="relative">
        <Back to="/" />
        <Title>Chatting with: {location.state.username2}</Title>
      </div>

      {messages.map((msg, index) => (
        <p key={index} className="p-2 rounded-md bg-slate-200">
          {msg}
        </p>
      ))}

      <form onSubmit={handleSubmit} className="flex gap-x-2">
        <Input
          type="text"
          name="test"
          placeholder="Type a message..."
          ref={messageInput}
          className="w-full"
        />

        <Button>
          <i class="fa-solid fa-paper-plane"></i>
        </Button>
      </form>
    </Container>
  )
}

export default Chat
