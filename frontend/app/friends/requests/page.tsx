import AxiosInstance from "@/components/utils/AxiosInstance"
import { ActionButton } from "./RequestButtons"
import { BaseUser } from "@/types/User.type"
import Header from "@/components/ui/Header"
import { friendRequestAction } from "./actions"
import { authOptions } from "@/api/auth/[...nextauth]"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function FriendRequests() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/signin?callbackUrl=/friends/requests")

  const axiosInstance = AxiosInstance(session!)
  const { data } = await axiosInstance.get("/api/handle-friends/")

  return (
    <>
      <Header href="/friends" title="Friend Requests" />

      {data.length > 0 ? (
        <div className="custom-scroll-bar">
          {data.map((user: BaseUser) => (
            <div
              className="mb-3 mr-2 flex items-center justify-between rounded-xl bg-slate-200 p-2"
              key={Number(user.id)}
            >
              <p>{user.username} wants to be your friend!</p>
              <div className="flex items-center gap-x-6">
                <ActionButton type="accept" action={friendRequestAction} session={session!} id={user.id} />
                <ActionButton type="reject" action={friendRequestAction} session={session!} id={user.id} />
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
