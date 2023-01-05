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
  const { data: userData } = useFetch("api/get-friend-requests/")

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
              {userData.num_requests > 0 && (
                <div className="absolute -top-3 -right-3 w-7 h-7 bg-red-400 rounded-full">
                  <Center>{userData.num_requests}</Center>
                </div>
              )}
            </Button>
          </Link>
        </div>
      </Header>

      {/* Friends list */}
      {data.length !== 0 ? (
        <>
          <div className="text-xl mb-1 pb-2 border-b-2 grid grid-cols-4 text-center">
            <p>Name</p>
            <p>Status</p>
            <p>Chat</p>
            <p>Remove</p>
          </div>
          <div className="custom-scroll-bar flex flex-col gap-y-4">
            {data.map((friend) => (
              <FriendDetails
                key={friend.id}
                friend={friend}
                refetchFriends={refetchFriends}
              />
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
