import { useNavigate } from "react-router-dom"
import generateHash from "../../components/utils/GenerateHash"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import useAxios from "../../components/hooks/useAxios"

const FriendDetails = ({ friend, refetchFriends }) => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const axiosInstance = useAxios()

  // Creating a unique chat id, according to the two users
  const createChatID = async (username2) => {
    const hash = await generateHash(user.username, username2)
    navigate(`/chat/${hash}`, { state: { username2 } })
  }

  // Deleting a friend
  const deleteFriend = async (id) => {
    await axiosInstance.put("api/handle-friends/", { id, action: "remove" })
    await refetchFriends()
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
      <button onClick={() => deleteFriend(friend.id)}>
        <i className="fa-solid fa-user-minus text-red-600"></i>
      </button>
    </div>
  )
}

export default FriendDetails
