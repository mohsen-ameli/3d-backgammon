"use server"

import AxiosInstance from "@/components/utils/AxiosInstance"
import { BaseUser } from "@/types/User.type"
import { Session } from "next-auth"

// Search for a friend
export async function search(session: Session, typed: string) {
  const axiosInstance = AxiosInstance(session)

  const { data }: { data: BaseUser[] } = await axiosInstance.get(`/api/search-friend/${typed}/`)
  return data
}

// Send friend request
export async function sendFriendRequest(session: Session, id: string) {
  type Data = { message: string; error: boolean }

  const axiosInstance = AxiosInstance(session)

  const { data }: { data: Data } = await axiosInstance.put("/api/handle-friends/", { id, action: "add" })
  return data
}
