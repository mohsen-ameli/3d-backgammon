import { useNavigate } from "react-router-dom"
import useAxios from "../../components/hooks/useAxios"

/**
 * This is the column that shows friend details.
 * @param friend The friend object passed down from FriendsList component
 * @param setLoading The function to set the loading state
 */
const FriendDetails = ({ friend, setLoading }) => {
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
        lastLogin: friend.last_login,
      },
    })
  }

  // Deleting a friend
  const deleteFriend = async (id) => {
    setLoading(true)
    await axiosInstance.put("api/handle-friends/", { id, action: "remove" })
  }

  // Playing with a friend
  const play = async (friend) => {
    if (friend.is_online) {
      await axiosInstance.put("api/game/handle-match-request/", {
        action: "send",
        friend_id: friend.id,
      })
    }
  }

  return (
    <div className="grid grid-cols-5 relative">
      {/* Name */}
      <div
        className={
          "w-full custom-scroll-bar col-span-2 ml-6 self-center " +
          (friend.is_online ? "text-black" : "text-slate-600")
        }
      >
        {friend.username}
      </div>
      {/* Status */}
      <div
        className={
          "absolute w-4 h-4 rounded-full self-center left-0 " +
          (friend.is_online ? "bg-green-500" : "bg-red-500")
        }
      />
      {/* Chat */}
      <button
        onClick={() => goToChat(friend)}
        className="fa-solid fa-comment-dots self-center justify-self-center text-xl text-emerald-600 hover:text-emerald-900 hover:ease-in-out duration-75"
      />
      {/* Play */}
      <button
        className={
          "fa-solid fa-dice self-center justify-self-center " +
          (friend.is_online
            ? "text-indigo-600 hover:text-indigo-900"
            : "cursor-default")
        }
        onClick={() => play(friend)}
      />
      {/* Remove */}
      <button
        className="fa-solid fa-trash-can self-center justify-self-center text-red-600 hover:text-red-900"
        onClick={() => deleteFriend(friend.id)}
      />
    </div>
  )
}

// TODO: For long usernames, use this to make the text scroll
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
