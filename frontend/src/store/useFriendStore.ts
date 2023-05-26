import { FriendType } from "@/types/Friend.type"
import { create } from "zustand"

export const useFriendStore = create<{ friend: FriendType | null; uuid: string | undefined }>((set) => ({
  friend: null,
  uuid: undefined,
}))
