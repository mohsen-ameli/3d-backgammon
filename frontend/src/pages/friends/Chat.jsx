import { useCallback, useEffect, useRef, useState } from "react"
import { useLocation, useNavigate, useParams, Navigate } from "react-router-dom"
import Button from "../../components/ui/Button"
import Container from "../../components/ui/Container"
import Input from "../../components/ui/Input"
import Header from "../../components/ui/Header"

const Chat = () => {
  const [messages, setMessages] = useState([])
  const messageInput = useRef()
  const uuid = useParams().uuid
  const navigate = useNavigate()
  const location = useLocation()

  // Create WebSocket connection.
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
      <Header to="/" title={`Chatting with: ${location.state.username2}`} />

      <div className="mb-14 custom-scroll-bar">
        {messages.map((msg, index) => (
          <p key={index} className="p-2 mb-2 mr-2 rounded-md bg-slate-200">
            {msg}
          </p>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full fixed bottom-0 left-0 p-3 flex gap-x-2"
      >
        <Input
          type="text"
          name="test"
          placeholder="Type a message..."
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

export default Chat
