import Container from "../../components/ui/Container"
import Center from "../../components/ui/Center"
import Button from "../../components/ui/Button"
import { Link } from "react-router-dom"
import Header from "../../components/ui/Header"
import FriendDetails from "./FriendDetails"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import Loading from "../../components/ui/Loading"
import { FriendType } from "./Friend.type"
import { BaseUser } from "../../context/BaseUser.type"

type FriendData = {
  num_requests: number
  friends: FriendType[]
  game_requests: BaseUser[]
  rejected_request: BaseUser
  live_game: string
}

/**
 * This is the friends list page.
 */
const FriendsList = () => {
  const [data, setData] = useState<FriendData>()
  const [loading, setLoading] = useState(true)
  const { ws } = useContext(AuthContext)

  // Handling incoming messages
  const onMessage = (e: MessageEvent) => {
    const data = JSON.parse(e.data)

    if (data.updates_on !== "friends-list") return

    setData(data)
    setLoading(false)
  }

  const onOpen = () => ws?.send(JSON.stringify({ updates_on: "friends-list" }))

  useEffect(() => {
    if (!ws) return

    ws.addEventListener("open", onOpen)
    ws.addEventListener("message", onMessage)

    // prettier-ignore
    if (ws.readyState !== WebSocket.CLOSED && ws.readyState !== WebSocket.CONNECTING)
      onOpen()

    return () => {
      ws.send(JSON.stringify({ updates_on: "status" }))
      ws.removeEventListener("message", onMessage)
      ws.removeEventListener("open", onOpen)
    }
  }, [ws])

  return (
    <Container className="gap-y-2">
      {/* Header */}
      <Header to="/" title="Friends List">
        <div className="absolute right-0 -top-1 flex gap-x-2">
          {/* Search for new friends */}
          <Link to="/search-friend">
            <Button className="relative px-2 py-1">
              <i className="fa-solid fa-user-plus"></i>
            </Button>
          </Link>

          {/* Friend requests */}
          <Link to="/friend-requests">
            <Button className="relative px-3 py-1">
              <i className="fa-solid fa-bell"></i>
              {data?.num_requests! > 0 && (
                <div className="absolute -top-5 -right-6 h-7 w-7 rounded-full bg-red-400 text-lg">
                  <Center>{data?.num_requests}</Center>
                </div>
              )}
            </Button>
          </Link>
        </div>
      </Header>

      {loading ? (
        <Loading basic />
      ) : data && data.friends.length !== 0 ? (
        <>
          {/* Friends list */}
          <div className="mb-1 grid grid-cols-5 border-b-2 pb-2 text-center text-xl">
            <p className="col-span-2">Name</p>
            <p>Chat</p>
            <p>Play</p>
            <p>Remove</p>
          </div>
          <div className="custom-scroll-bar flex flex-col gap-y-4">
            {data.friends.map((friend: FriendType) => (
              <FriendDetails
                key={friend.id}
                friend={friend}
                setLoading={setLoading}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="mt-4 text-center text-xl font-semibold">No friends :(</p>
      )}
    </Container>
  )
}

export default FriendsList
