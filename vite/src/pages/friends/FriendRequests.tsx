import useAxios from "../../components/hooks/useAxios"
import useFetch from "../../components/hooks/useFetch"
import Container from "../../components/ui/Container"
import Header from "../../components/ui/Header"
import Loading from "../../components/ui/Loading"

const FriendRequests = () => {
  const { data, loading, setLoading, fetchData } = useFetch(
    "/api/handle-friends/"
  )

  const axiosInstance = useAxios()

  const acceptFriendRequest = async (id: number) => {
    setLoading(true)
    await axiosInstance.put("/api/handle-friends/", {
      id,
      action: "accept",
    })
    fetchData()
  }

  const rejectFriendRequest = async (id: number) => {
    setLoading(true)
    await axiosInstance.put("/api/handle-friends/", {
      id,
      action: "reject",
    })
    fetchData()
  }

  return (
    <Container>
      <Header to="/friends" title="Friend Requests" />

      {loading ? (
        <Loading basic />
      ) : data.length > 0 ? (
        <div className="custom-scroll-bar">
          {data.map((user: { username: string; id: number }, index: number) => (
            <div
              className="mb-3 mr-2 flex items-center justify-between rounded-md bg-slate-200 p-2"
              key={index}
            >
              <p>{user.username} wants to be your friend!</p>
              <div className="flex items-center gap-x-8">
                <i
                  className="fa-solid fa-check cursor-pointer p-1 text-2xl text-green-500 hover:text-green-700"
                  onClick={() => acceptFriendRequest(user.id)}
                />
                <i
                  className="fa-solid fa-xmark cursor-pointer py-1 px-2 text-2xl text-red-500 hover:text-red-700"
                  onClick={() => rejectFriendRequest(user.id)}
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
