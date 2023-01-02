import { useEffect, useRef, useState } from "react"
import Button from "./components/ui/Button"

const Chat = () => {
  const [messages, setMessages] = useState([])
  const messageInput = useRef()

  const uuid = crypto.randomUUID()

  // Create WebSocket connection.
  // TODP: probably get the uuid from the url
  const ws = new WebSocket(
    `ws://localhost:8000/ws/game/05e81fb8-9d46-4a21-a8bd-2ec144b35025/`
  )

  const close = () => ws.close()

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
  }, [])

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

  return (
    <div className="p-2 w-[300px] left-2 top-2 rounded-md relative bg-gray-400 flex flex-col gap-y-4">
      <Button onClick={close} className="w-fit">
        Back
      </Button>

      {messages.map((msg, index) => (
        <p key={index} className="p-2 rounded-md bg-slate-200">
          {msg}
        </p>
      ))}

      <form onSubmit={handleSubmit} className="flex gap-x-2">
        <input
          type="text"
          name="test"
          ref={messageInput}
          className="px-2 py-2 outline-none rounded-lg"
        />

        <Button>Send</Button>
      </form>
    </div>
  )
}

export default Chat
