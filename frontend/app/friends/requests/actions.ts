"use server"

import AxiosInstance from "@/components/utils/AxiosInstance"
import { Session } from "next-auth"
import { revalidatePath } from "next/cache"

// Server action to handle a friend request and revalidate the page
export async function friendRequestAction(session: Session, id: number, action: "accept" | "reject") {
  const axiosInstance = AxiosInstance(session!)

  try {
    await axiosInstance.put("/api/handle-friends/", { id, action })
    revalidatePath("/friends/requests")
  } catch (e) {}
}
