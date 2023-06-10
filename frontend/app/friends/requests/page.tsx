"use client"

import AxiosInstance from "@/components/utils/AxiosInstance"
import { AcceptButton, RejectButton } from "./RequestButtons"
import { BaseUser } from "@/types/User.type"
import Header from "@/components/ui/Header"
import { friendRequestAction } from "./actions"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Loading from "@/components/ui/Loading"

// export const dynamic = "force-dynamic"
// export const fetchCache = "force-no-store"

export default function FriendRequests() {
  const { data: session } = useSession()

  const [data, setData] = useState<BaseUser[] | null>(null)

  async function fetchStuff() {
    const axiosInstance = AxiosInstance(session!)
    const res = await axiosInstance.get("/api/handle-friends/")
    setData(res.data)
  }

  useEffect(() => {
    if (session && !data) fetchStuff()
  }, [session])

  if (!data)
    return (
      <>
        <Header href="/friends" title="Friend Requests" />
        <Loading basic center />
      </>
    )

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
                <AcceptButton action={friendRequestAction} fetchStuff={fetchStuff} session={session!} id={user.id} />
                <RejectButton action={friendRequestAction} fetchStuff={fetchStuff} session={session!} id={user.id} />
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
