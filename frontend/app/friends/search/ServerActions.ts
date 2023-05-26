"use server"

import { authOptions } from "@/api/auth/[...nextauth]/route"
import getJWTToken from "@/components/utils/getJWTToken"
import getServerUrl from "@/components/utils/getServerUrl"
import { BaseUser } from "@/types/User.type"
import axios from "axios"
import { getServerSession } from "next-auth"

// Search for a friend
export async function search(typed: string) {
  const session = await getServerSession(authOptions)
  const token = await getJWTToken(session!.user.token)

  const { data }: { data: BaseUser[] } = await axios.get(`${getServerUrl()}/api/search-friend/${typed}/`, {
    headers: {
      Authorization: `Bearer ${token.access}`,
    },
  })
  return data
}

// Send friend request
export async function sendFriendRequest(id: number) {
  type Data = { message: string; error: boolean }

  const session = await getServerSession(authOptions)
  const token = await getJWTToken(session!.user.token)

  const { data }: { data: Data } = await axios.put(
    getServerUrl() + "/api/handle-friends/",
    { id, action: "add" },
    {
      headers: {
        Authorization: `Bearer ${token.access}`,
      },
    },
  )
  return data
}
