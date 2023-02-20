import Container from "../../components/ui/Container"
import Input from "../../components/ui/Input"
import { useEffect, useState } from "react"
import Button from "../../components/ui/Button"
import useAxios from "../../components/hooks/useAxios"
import Header from "../../components/ui/Header"
import getServerUrl from "../../components/utils/getServerUrl"

const SearchFriend = () => {
  const [ws] = useState(
    () => new WebSocket(`${getServerUrl(false)}/ws/search-friend/`)
  )
  const [friends, setFriends] = useState([])
  const [error, setError] = useState()

  const axiosInstance = useAxios()

  useEffect(() => {
    // Getting list of potential friends
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data)
      if (data.results.length > 0) {
        setFriends(data.results)
      } else {
        setFriends([])
      }
    }

    return () => ws.close()
  }, [ws])

  // Searching for potential friends
  const search = (e) => {
    const typed = e.target.value

    if (typed === "") return

    error && setError(false)
    // fetch
    ws.send(
      JSON.stringify({
        typed,
      })
    )
  }

  // Send friend request
  const sendFriendReequest = async (id) => {
    try {
      await axiosInstance.put(`${getServerUrl()}/api/handle-friends/`, {
        id,
        action: "add",
      })
    } catch (err) {
      setError(err.response.data[0])
    }
  }

  return (
    <Container>
      <Header to="/friends" title="Search For a New Friend" />

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
              className="flex items-center justify-between p-2 mb-2 mr-2 rounded-lg bg-slate-200"
            >
              <p>{friend.username}</p>
              <AddButton
                sendFriendReequest={sendFriendReequest}
                friend={friend}
                setError={setError}
                error={error}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>
          No user found with the specified name or email. (Did you spell
          something wrong?)
        </p>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </Container>
  )
}

const AddButton = ({ sendFriendReequest, friend, setError, error }) => {
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    sendFriendReequest(friend.id)
    setClicked(true)
  }

  return (
    <>
      {clicked && !error ? (
        <i className="fa-solid fa-check p-1 text-2xl mr-4 text-green-700" />
      ) : (
        <Button onClick={handleClick}>Add</Button>
      )}
    </>
  )
}

export default SearchFriend
