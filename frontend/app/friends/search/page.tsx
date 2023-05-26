import { authOptions } from "@/api/auth/[...nextauth]/route"
import Header from "@/components/ui/Header"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import SearchForm from "./SearchForm"
import { search, sendFriendRequest } from "./ServerActions"

export default async function SearchPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/signin?callbackUrl=/friends/search")

  return (
    <>
      <Header href="/friends" title="Add a Friend" />
      <SearchForm search={search} sendFriendRequest={sendFriendRequest} />
    </>
  )
}
