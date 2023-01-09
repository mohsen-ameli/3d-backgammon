import { useNavigate } from "react-router-dom"
import generateHash from "../../components/utils/GenerateHash"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import useAxios from "../../components/hooks/useAxios"

const FriendDetails = ({ friend }) => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const axiosInstance = useAxios()

  // Going to the chat room between the two users
  const goToChat = async (friend) => {
    const res = await axiosInstance.get(`api/get-chat-uuid/${friend.id}`)
    navigate(`/chat`, {
      state: {
        uuid: res.data.chat_uuid,
        friend: friend.username,
        status: friend.is_online,
      },
    })
  }

  // Deleting a friend
  const deleteFriend = async (id) => {
    await axiosInstance.put("api/handle-friends/", { id, action: "remove" })
  }

  return (
    <div className="grid grid-cols-4">
      {/* Name */}
      <div className="w-full custom-scroll-bar">{friend.username}</div>
      {/* Status */}
      <div
        className={
          "w-4 h-4 rounded-full self-center justify-self-center " +
          (friend.is_online ? "bg-green-500" : "bg-red-500")
        }
      />
      {/* Chat */}
      <button
        onClick={() => goToChat(friend)}
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

// function ScrollingBox({ text }) {
//   const boxRef = useRef(null)

//   useEffect(() => {
//     gsap.to(boxRef.current, {
//       xPercent: 100,
//       repeat: -1,
//       ease: "ease-in-out",
//       duration: 1,
//     })
//   }, [])

//   return (
//     <div ref={boxRef} className="w-full overflow-x-hidden">
//       {text}
//     </div>
//   )
// }

export default FriendDetails
