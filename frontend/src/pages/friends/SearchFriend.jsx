import Container from "../../components/ui/Container"
import Input from "../../components/ui/Input"
import { useEffect, useRef, useState } from "react"
import Button, { ButtonLoading } from "../../components/ui/Button"
import useAxios from "../../components/hooks/useAxios"
import Header from "../../components/ui/Header"
import getServerUrl from "../../components/utils/getServerUrl"

const SearchFriend = () => {
  const [ws] = useState(
    () => new WebSocket(`${getServerUrl(false)}/ws/search-friend/`)
  )
  const [friends, setFriends] = useState([])
  const [error, setError] = useState()
  const [typed, setTyped] = useState("")

  const axiosInstance = useAxios()

  useEffect(() => {
    // Getting list of potential friends
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data)

      setFriends(data.results.length > 0 ? data.results : [])
    }

    return () => ws.close()
  }, [ws])

  // Searching for potential friends
  const search = (e) => {
    const searchFor = e.target.value

    setTyped(searchFor)

    if (searchFor === "") return

    error && setError(false)
    // fetch
    ws.send(
      JSON.stringify({
        typed: searchFor,
      })
    )
  }

  // Send friend request
  const sendFriendReequest = async (id) => {
    try {
      await axiosInstance.put("/api/handle-friends/", {
        id,
        action: "add",
      })
      setError(null)
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
        maxLength={60}
        onChange={search}
      />

      {typed !== "" &&
        (friends.length > 0 ? (
          friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between px-2 h-14 mb-1 rounded-lg bg-slate-200"
            >
              <p>{friend.username}</p>
              <AddButton
                sendFriendReequest={sendFriendReequest}
                friend={friend}
                error={error}
              />
            </div>
          ))
        ) : (
          <ErrorMsg />
        ))}

      {error && <p className="text-red-500">{error}</p>}
    </Container>
  )
}

const ErrorMsg = () => {
  return (
    <p>
      No user found with the specified name or email. (Did you spell something
      wrong?)
    </p>
  )
}

const AddButton = ({ sendFriendReequest, friend, error }) => {
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    sendFriendReequest(friend.id)
    setClicked(true)
  }

  if (clicked) {
    if (error === null) {
      return (
        <i className="fa-solid fa-check p-1 text-2xl mr-4 text-green-700" />
      )
    } else if (error === undefined) {
      return (
        <Button className="w-20">
          <ButtonLoading />
        </Button>
      )
    }
  } else {
    return (
      <Button onClick={handleClick} className="w-20">
        Add
      </Button>
    )
  }
}

export default SearchFriend
