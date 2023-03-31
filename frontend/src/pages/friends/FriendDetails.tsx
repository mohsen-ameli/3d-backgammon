import { useLocation, useNavigate } from "react-router-dom"
import useAxios from "../../components/hooks/useAxios"
import notification from "../../components/utils/Notification"
import { FriendType } from "./Friend.type"
import PlayButton from "./PlayButton"

type FriendDetailsProps = {
  friend: FriendType
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * This is the column that shows friend details.
 * @param friend The friend object passed down from FriendsList component
 * @param setLoading The function to set the loading state
 */
const FriendDetails = ({ friend, setLoading }: FriendDetailsProps) => {
  const navigate = useNavigate()
  const axiosInstance = useAxios()
  const location = useLocation()

  // Going to the chat room between the two users
  const goToChat = async (friend: FriendType) => {
    const res = await axiosInstance.get(`/api/get-chat-uuid/${friend.id}/`)
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
  const deleteFriend = async (id: number) => {
    setLoading(true)
    await axiosInstance.put("/api/handle-friends/", {
      id,
      action: "remove",
    })
  }

  // Requesting to play with a friend
  const play = async (friend: FriendType) => {
    if (!friend.is_online) return

    const res = await axiosInstance.put("/api/game/handle-match-request/", {
      action: "send",
      friend_id: friend.id,
    })
    if (!res.data.success) notification("Your friend is not online!", "error")

    // Showing a rejection notification after 10 seconds
    setTimeout(() => {
      if (window.location.pathname.includes("game")) return
      const msg = `${friend.username} rejected your match request.`
      notification(msg, "deleteRejected")
    }, 10000)
  }

  return (
    <div className="relative grid grid-cols-5">
      {/* Name */}
      <div
        className={
          "custom-scroll-bar col-span-2 ml-6 w-full self-center " +
          (friend.is_online ? "text-black" : "text-slate-600")
        }
      >
        {friend.username}
      </div>

      {/* Status */}
      <div
        className={
          "absolute left-0 h-4 w-4 self-center rounded-full " +
          (friend.is_online ? "bg-green-500" : "bg-red-500")
        }
      />

      {/* Chat */}
      <button
        onClick={() => goToChat(friend)}
        className="fa-solid fa-comment-dots self-center justify-self-center text-xl text-emerald-600 duration-75 hover:text-emerald-900 hover:ease-in-out"
      />

      {/* Play */}
      <PlayButton friend={friend} play={play} />

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
