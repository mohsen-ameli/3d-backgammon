import { create } from "zustand"
import { BaseUser } from "@/types/User.type"

type SearchStore = {
  friends: BaseUser[]
}

export const searchStore = create<SearchStore>(set => ({
  friends: [],
}))
