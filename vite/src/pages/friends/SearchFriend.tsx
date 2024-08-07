import { AxiosError } from "axios"
import React, { useEffect, useState } from "react"
import useAxios from "../../components/hooks/useAxios"
import Button, { ButtonLoading } from "../../components/ui/Button"
import Container from "../../components/ui/Container"
import Header from "../../components/ui/Header"
import Input from "../../components/ui/Input"
import getServerUrl from "../../components/utils/getServerUrl"
import wsGood from "../../components/utils/wsGood"
import { FriendType } from "./Friend.type"

const SearchFriend = () => {
  const [ws] = useState(
    () => new WebSocket(`${getServerUrl(false)}/ws/search-friend/`)
  )
  const [friends, setFriends] = useState([])
  const [error, setError] = useState<boolean | string | null>()
  const [typed, setTyped] = useState("")

  const axiosInstance = useAxios()

  useEffect(() => {
    // Getting list of potential friends
    ws.onmessage = e => {
      const data = JSON.parse(e.data)

      setFriends(data.results.length > 0 ? data.results : [])
    }

    return () => {
      wsGood(ws) && ws.close()
    }
  }, [ws])

  // Searching for potential friends
  const search = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  const sendFriendRequest = async (id: number) => {
    try {
      await axiosInstance.put("/api/handle-friends/", {
        id,
        action: "add",
      })
      setError(null)
    } catch (error: AxiosError | unknown) {
      if (error instanceof AxiosError) setError(error?.response!.data[0])
    }
  }

  return (
    <Container>
      <Header to="/friends" title="Add a New Friend" />

      <Input
        className="mb-4"
        type="text"
        placeholder="Name or Email"
        maxLength={60}
        onChange={search}
      />

      {typed !== "" &&
        (friends.length > 0 ? (
          friends.map((friend: FriendType) => (
            <div
              key={friend.id}
              className="mb-1 flex h-14 items-center justify-between rounded-lg bg-slate-200 px-2"
            >
              <p>{friend.username}</p>
              <AddButton
                sendFriendRequest={sendFriendRequest}
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

type AddButtonType = {
  sendFriendRequest: (id: number) => void
  friend: FriendType
  error: string | boolean | null | undefined
}

const AddButton = ({ sendFriendRequest, friend, error }: AddButtonType) => {
  const [clicked, setClicked] = useState(false)

  const handleClick = () => {
    sendFriendRequest(friend.id)
    setClicked(true)
  }

  if (clicked) {
    if (error === null) {
      return (
        <i className="fa-solid fa-check mr-4 p-1 text-2xl text-green-700" />
      )
    } else if (error === undefined) {
      return (
        <Button className="w-20">
          <ButtonLoading />
        </Button>
      )
    } else {
      return <></>
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
