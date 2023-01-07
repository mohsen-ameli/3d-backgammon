import Container from "../../components/ui/Container"
import Center from "../../components/ui/Center"
import Button from "../../components/ui/Button"
import { Link, useLocation } from "react-router-dom"
import Header from "../../components/ui/Header"
import FriendDetails from "./FriendDetails"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import useFetch from "../../components/hooks/useFetch"

const Friends = () => {
  const location = useLocation()
  const [data, setData] = useState()
  const { tokens } = useContext(AuthContext)
  const { data: d1 } = useFetch("/")
  const [ws, setWs] = useState(
    () => new WebSocket(`ws://localhost:8000/ws/friends/${tokens.access}/`)
  )

  // useEffect(() => {
  //   if (d1) {
  //     const tokens = JSON.parse(localStorage.getItem("tokens"))
  //     setWs(
  //       () => new WebSocket(`ws://localhost:8000/ws/friends/${tokens.access}/`)
  //     )
  //   }
  // }, [d1])

  // Retrieving the friends list live from the server
  useEffect(() => {
    if (ws) {
      ws.onopen = () => {
        console.log("Connected to the server")
      }

      ws.onmessage = (e) => {
        const data = JSON.parse(e.data)
        setData(data)
      }
    }
  }, [])

  // Closeing the connection, when the component unmounts
  useEffect(() => {
    return () => {
      ws.close()
    }
  }, [location])

  return (
    <Container className="gap-y-2">
      {/* Header */}
      <Header to="/" title="Friends List">
        <div className="flex gap-x-2 absolute right-0 top-0">
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
              {data?.num_requests > 0 && (
                <div className="absolute -top-3 -right-3 w-7 h-7 bg-red-400 rounded-full">
                  <Center>{data?.num_requests}</Center>
                </div>
              )}
            </Button>
          </Link>
        </div>
      </Header>

      {/* Friends list */}
      {data?.friends.length !== 0 ? (
        <>
          <div className="text-xl mb-1 pb-2 border-b-2 grid grid-cols-4 text-center">
            <p>Name</p>
            <p>Status</p>
            <p>Chat</p>
            <p>Remove</p>
          </div>
          <div className="custom-scroll-bar flex flex-col gap-y-4">
            {data?.friends.map((friend) => (
              <FriendDetails key={friend.id} friend={friend} />
            ))}
          </div>
        </>
      ) : (
        <p className="text-center">No friends online</p>
      )}
    </Container>
  )
}

export default Friends
