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
      {/* Name */}
      <p className="self-center justify-self-center">{friend.username}</p>
      {/* Status */}
      <div
        className={
          "w-4 h-4 rounded-full self-center justify-self-center " +
          (friend.is_online ? "bg-green-500" : "bg-red-500")
        }
      />
      {/* Chat */}
      <button
        onClick={() => createChatID(friend.username)}
        className="fa-solid fa-comment-dots self-center justify-self-center text-xl text-emerald-500 hover:text-emerald-800 hover:ease-in-out duration-75"
      />
      {/* Remove */}
      <button
        className="fa-solid fa-trash-can self-center justify-self-center text-red-500 hover:text-red-800"
        onClick={() => deleteFriend(friend.id)}
      />
    </div>
  )
}

export default FriendDetails
