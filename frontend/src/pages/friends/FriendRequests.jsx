import useFetch from "../../components/hooks/useFetch"
import Container from "../../components/ui/Container"
import Header from "../../components/ui/Header"

const FriendRequests = () => {
  const { data, loading, error } = useFetch("api/get-user-data/")

  console.log(data)

  return (
    <Container>
      <Header to="/friends" title="Friend Requests" />

      {data.friend_requests?.map((req, index) => (
        <div key={index}>
          <p>{req}</p>
        </div>
      ))}
    </Container>
  )
}

export default FriendRequests
