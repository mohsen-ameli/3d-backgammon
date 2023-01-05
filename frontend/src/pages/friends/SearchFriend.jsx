import Container from "../../components/ui/Container"
import Input from "../../components/ui/Input"
import { useEffect, useState } from "react"
import Button from "../../components/ui/Button"
import useAxios from "../../components/hooks/useAxios"
import Header from "../../components/ui/Header"

const SearchFriend = () => {
  const [ws] = useState(
    () => new WebSocket("ws://localhost:8000/ws/search-friend/")
  )
  const [friends, setFriends] = useState([])

  const axiosInstance = useAxios()

  useEffect(() => {
    // Connect to server
    ws.onopen = () => {
      console.log("Connected to server")
    }

    // Closing the connection
    ws.onclose = () => {
      console.log("closed")
    }

    // Getting list of potential friends
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data)
      if (data.results.length > 0) {
        setFriends(data.results)
      } else {
        setFriends([])
      }
    }

    return () => {
      ws.close()
    }
  }, [ws])

  // Searching for potential friends
  const search = (e) => {
    const typed = e.target.value

    if (typed !== "") {
      // fetch
      ws.send(
        JSON.stringify({
          typed,
        })
      )
    }
  }

  // Send friend request
  const sendFriendReequest = async (id) => {
    // fetch
    await axiosInstance.put("api/handle-friends/", { id, action: "add" })
  }

  return (
    <Container>
      <Header to="/friends" title="Search for new friend" />

      <Input
        className="mb-4"
        type="text"
        placeholder="Name or Email"
        onChange={search}
      />

      {friends.length > 0 ? (
        <div className="custom-scroll-bar">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between p-2 mb-2 mr-2 rounded-lg bg-slate-400"
            >
              <p>{friend.username}</p>
              <Button onClick={() => sendFriendReequest(friend.id)}>Add</Button>
            </div>
          ))}
        </div>
      ) : (
        <p>No user found with the specified name or email.</p>
      )}
    </Container>
  )
}

export default SearchFriend
