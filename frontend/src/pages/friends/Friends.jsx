import Container from "../../components/ui/Container"
import useFetch from "../../components/hooks/useFetch"
import Center from "../../components/ui/Center"
import Button from "../../components/ui/Button"
import { Link, useNavigate } from "react-router-dom"
import generateHash from "../../components/utils/GenerateHash"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import Back from "../../components/ui/Back"
import Title from "../../components/ui/Title"

const Friends = () => {
  const { data, error, loading } = useFetch("api/handle-friends/")

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

      {/* Header section */}
      <div className="relative mb-6">
        <Back to="/" />
        <Title>Friends list</Title>
        <Link to="/search-friend" className="absolute right-0 top-0">
          <Button>
            <i className="fa-solid fa-user-plus"></i>
          </Button>
        </Link>
      </div>

      {data.length !== 0 ? (
        <>
          <div className="text-xl mb-4 pb-3 border-b-2 grid grid-cols-4 text-center">
            <p>Name</p>
            <p>Status</p>
            <p>Chat</p>
            <p>Remove</p>
          </div>
          {data.map((friend) => (
            <FriendDetails key={friend.id} friend={friend} />
          ))}
        </>
      ) : (
        <p className="text-center">No friends online</p>
      )}
    </Container>
  )
}

const FriendDetails = ({ friend }) => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  // Creating a unique chat id, according to the two users
  const createChatID = async (username2) => {
    const hash = await generateHash(user.username, username2)
    navigate(`/chat/${hash}`, { state: { username2 } })
  }

  return (
    <div className="grid grid-cols-4">
      <p className="self-center justify-self-center">{friend.username}</p>
      <div
        className={
          "w-4 h-4 rounded-full self-center justify-self-center " +
          (friend.is_online ? "bg-green-500" : "bg-red-500")
        }
      ></div>
      <button
        onClick={() => createChatID(friend.username)}
        className="hover:text-slate-600 hover:ease-in-out duration-75"
      >
        <i className="fa-solid fa-comment-dots text-xl p-2"></i>
      </button>
      <button>
        <i className="fa-solid fa-user-minus text-red-600"></i>
      </button>
    </div>
  )
}

export default Friends
