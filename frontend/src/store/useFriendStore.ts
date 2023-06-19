import { FriendType } from "@/types/Friend.type"
import { create } from "zustand"

type FriendStore = { friend: FriendType | null; uuid: string | undefined }

export const useFriendStore = create<FriendStore>(set => ({
  friend: null,
  uuid: undefined,
}))
