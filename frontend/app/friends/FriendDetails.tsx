import notification from "@/components/utils/Notification"
import { FriendType } from "@/types/Friend.type"
import PlayButton from "./PlayButton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCommentDots, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { Session } from "next-auth"
import AxiosInstance from "@/components/utils/AxiosInstance"
import { useRouter } from "next/navigation"
import { useFriendStore } from "@/store/useFriendStore"

// export const dynamic = "force-dynamic"

/**
 * This is the column that shows friend details.
 * @param friend The friend object passed down from FriendsList component
 * @param session
 */
export default function FriendDetails({ friend, session }: { friend: FriendType; session: Session }) {
  const axiosInstance = AxiosInstance(session)
  const router = useRouter()

  // Going to the chat room between the two users
  async function goToChat(friend: FriendType) {
    type Data = { data: { chat_uuid: string } }

    const { data }: Data = await axiosInstance.get(`/api/get-chat-uuid/${friend.id}/`)

    router.push("/friends/chat/")
    useFriendStore.setState({ friend, uuid: data.chat_uuid })
  }

  // Deleting a friend
  async function deleteFriend(friend: FriendType) {
    async function accept() {
      await axiosInstance.put("/api/handle-friends/", { id: friend.id, action: "remove" })
    }
    notification(`Are you sure you want to delete ${friend.username}?`, "accept-only", false, accept)
  }

  // Requesting to play with a friend
  async function play(friend: FriendType) {
    type Data = { data: { success: boolean } }

    if (!friend.is_online) return

    const { data }: Data = await axiosInstance.put("/api/game/handle-match-request/", {
      action: "send",
      friend_id: friend.id,
    })

    if (!data.success) notification("Your friend is not online!", "error")

    // Showing a rejection notification after 10 seconds
    setTimeout(() => {
      if (window.location.pathname.includes("game")) return
      const msg = `${friend.username} rejected your match request.`
      notification(msg, "delete-rejected")
    }, 10000)
  }

  return (
    <div className="relative grid grid-cols-5">
      {/* Status */}
      <div
        className={
          "absolute left-[2px] top-1 h-4 w-4 self-center rounded-full " +
          (friend.is_online ? "bg-green-500" : "bg-red-500")
        }
      />

      {/* Name */}
      <div
        className={
          "custom-scroll-bar col-span-2 ml-6 w-full text-lg self-center " +
          (friend.is_online ? "text-black" : "text-slate-600")
        }
      >
        {friend.username}
      </div>

      {/* Chat */}
      <button
        onClick={() => goToChat(friend)}
        className="self-center justify-self-center text-xl text-emerald-600 hover:text-emerald-900"
      >
        <FontAwesomeIcon icon={faCommentDots} />
      </button>

      {/* Play */}
      <PlayButton friend={friend} play={play} />

      {/* Remove */}
      <button
        className="self-center justify-self-center text-xl text-red-600 hover:text-red-900"
        onClick={() => deleteFriend(friend)}
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    </div>
  )
}
