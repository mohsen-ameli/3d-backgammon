import Input from "@/components/ui/Input"
import { BaseUser } from "@/types/User.type"
import Header from "@/components/ui/Header"
import { searchStore } from "./searchStore"
import AxiosInstance from "@/components/utils/AxiosInstance"
import { authOptions } from "@/api/auth/[...nextauth]"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import AddButton from "./AddButton"
import { revalidatePath } from "next/cache"
import SearchButton from "./SearchButton"

export default async function SearchPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/signin?callbackUrl=/friends/search")

  const friends = searchStore.getState().friends

  // Search for a friend
  async function submit(formData: FormData) {
    "use server"

    const typed = formData.get("typed") as string
    if (typed === "") return

    const axiosInstance = AxiosInstance(session!)
    const { data }: { data: BaseUser[] } = await axiosInstance.get(`/api/search-friend/${typed}/`)

    searchStore.setState({ friends: data })
    revalidatePath("/friends/search")
  }

  // Send friend request
  async function sendFriendRequest(id: number) {
    "use server"

    type Data = { message: string; error: boolean }
    const axiosInstance = AxiosInstance(session!)
    const { data }: { data: Data } = await axiosInstance.put("/api/handle-friends/", { id, action: "add" })
    return data
  }

  return (
    <>
      <Header href="/friends" title="Add a Friend" />

      <form action={submit} className="mb-4 flex w-full gap-x-2">
        <Input className="flex-1" name="typed" type="text" placeholder="Name or Email" />
        <SearchButton />
      </form>

      {friends.length > 0 ? (
        friends.map(friend => (
          <div key={friend.id} className="mb-1 flex h-14 items-center justify-between rounded-lg bg-slate-200 px-2">
            <p>{friend.username}</p>
            <AddButton sendFriendRequest={sendFriendRequest} friend={friend} />
          </div>
        ))
      ) : (
        <p>No user found with the specified name or email. (Did you spell something wrong?)</p>
      )}
    </>
  )
}
