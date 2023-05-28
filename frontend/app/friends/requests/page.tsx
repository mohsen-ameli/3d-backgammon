import { authOptions } from "@/api/auth/[...nextauth]/route"
import AxiosInstance from "@/components/utils/AxiosInstance"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { AcceptButton, RejectButton } from "./RequestButtons"
import { BaseUser } from "@/types/User.type"

export default async function FriendRequests() {
  const session = await getServerSession(authOptions)
  const axiosInstance = AxiosInstance(session!)

  const { data }: { data: BaseUser[] } = await axiosInstance.get("/api/handle-friends/")

  // Server action to handle a friend request and revalidate the page
  async function handleFriendRequest(id: string, action: "accept" | "reject") {
    "use server"
    const axiosInstance = AxiosInstance(session!)

    try {
      console.log({ id, action })
      await axiosInstance.put("/api/handle-friends/", { id, action })
      revalidatePath("/friends/requests")
    } catch (e) {}
  }

  return (
    <>
      {data.length > 0 ? (
        <div className="custom-scroll-bar">
          {data.map((user: BaseUser) => (
            <div
              className="mb-3 mr-2 flex items-center justify-between rounded-md bg-slate-200 p-2"
              key={Number(user.id)}
            >
              <p>{user.username} wants to be your friend!</p>
              <div className="flex items-center gap-x-6">
                <AcceptButton action={handleFriendRequest} id={user.id} />
                <RejectButton action={handleFriendRequest} id={user.id} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No friend requests</p>
      )}
    </>
  )
}
