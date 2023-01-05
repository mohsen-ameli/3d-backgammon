import useAxios from "../../components/hooks/useAxios"
import useFetch from "../../components/hooks/useFetch"
import Container from "../../components/ui/Container"
import Header from "../../components/ui/Header"

const FriendRequests = () => {
  const { data, fetchData } = useFetch("api/get-friend-requests/")

  const axiosInstance = useAxios()

  const acceptFriendRequest = async (id) => {
    await axiosInstance.put("api/handle-friends/", { id, action: "accept" })
    fetchData()
  }

  const rejectFriendRequest = async (id) => {
    await axiosInstance.put("api/handle-friends/", { id, action: "reject" })
    fetchData()
  }

  return (
    <Container>
      <Header to="/friends" title="Friend Requests" />

      {data.num_requests > 0 ? (
        <div className="custom-scroll-bar">
          {data.friend_requests.map((req) => (
            <div
              className="p-2 mb-3 mr-2 flex items-center justify-between rounded-md bg-slate-200"
              key={req.id}
            >
              <p>{req.username}</p>
              <div className="flex items-center gap-x-8">
                <i
                  className="fa-solid fa-check p-1 text-2xl cursor-pointer text-green-500 hover:text-green-700"
                  onClick={() => acceptFriendRequest(req.id)}
                />
                <i
                  className="fa-solid fa-xmark py-1 px-2 text-2xl cursor-pointer text-red-500 hover:text-red-700"
                  onClick={() => rejectFriendRequest(req.id)}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No friend requests</p>
      )}
    </Container>
  )
}

export default FriendRequests
