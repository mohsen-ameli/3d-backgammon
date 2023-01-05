import Container from "../../components/ui/Container"
import useFetch from "../../components/hooks/useFetch"
import Center from "../../components/ui/Center"
import Button from "../../components/ui/Button"
import { Link } from "react-router-dom"
import Header from "../../components/ui/Header"
import FriendDetails from "./FriendDetails"

const Friends = () => {
  const {
    data,
    error,
    loading,
    fetchData: refetchFriends,
  } = useFetch("api/handle-friends/")
  const { data: userData } = useFetch("api/get-user-data/")

  // const jwtAccess =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjcyNzc4MDE3LCJpYXQiOjE2NzI3Nzc3MTcsImp0aSI6IjcxZGQ0OTZjNGUzMTQ0MDVhYzFhNWRlNWYwYTE1ZWYzIiwidXNlcl9pZCI6MX0.KYsCaqy---mor854XCWjnQvbPtciDRsQI6d1HXbpIpY"

  // const ws = new WebSocket(`ws://localhost:8000/ws/friends/${jwtAccess}/`)

  // useEffect(() => {
  //   ws.onopen = () => {
  //     console.log("Connected to the server")
  //   }

  //   ws.onmessage = (event) => {
  //     const data = JSON.parse(event.data)
  //     console.log(data.message)
  //   }
  // })

  return (
    <Container className="gap-y-2">
      <Center>
        {loading && <p>Loading...</p>}
        {error && (
          <p className="w-full text-center text-lg font-semibold text-red-600">
            {error.message}
          </p>
        )}
      </Center>

      <Header to="/" title="Friends list">
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
              {userData.friend_requests &&
                userData.friend_requests.length !== 0 && (
                  <div className="absolute -top-3 -right-3 w-7 h-7 bg-red-400 rounded-full">
                    <Center>{userData.friend_requests.length}</Center>
                  </div>
                )}
            </Button>
          </Link>
        </div>
      </Header>

      {data.length !== 0 ? (
        <>
          <div className="text-xl mb-4 pb-3 border-b-2 grid grid-cols-4 text-center">
            <p>Name</p>
            <p>Status</p>
            <p>Chat</p>
            <p>Remove</p>
          </div>
          {data.map((friend) => (
            <FriendDetails
              key={friend.id}
              friend={friend}
              refetchFriends={refetchFriends}
            />
          ))}
        </>
      ) : (
        <p className="text-center">No friends online</p>
      )}
    </Container>
  )
}

export default Friends
