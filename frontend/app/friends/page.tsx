"use client"

import Button from "@/components/ui/Button"
import Center from "@/components/ui/Center"
import Header from "@/components/ui/Header"
import Loading from "@/components/ui/Loading"
import getServerUrl from "@/components/utils/getServerUrl"
import { FriendType } from "@/types/Friend.type"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import FriendDetails from "./FriendDetails"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell } from "@fortawesome/free-regular-svg-icons"
import { faUserPlus } from "@fortawesome/free-solid-svg-icons"
import { BaseUser } from "@/types/User.type"

type Data = {
  num_requests: number
  friends: FriendType[]
  game_requests: BaseUser[]
  live_game: boolean
}

export default function FriendsPage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin?callbackUrl=/friends")
    },
  })

  const [ws, setWs] = useState<WebSocket | null>(null)
  const [data, setData] = useState<Data | null>(null)

  // Setting the websocket connection
  useEffect(() => {
    if (!session) return
    if (ws) return

    const url = `${getServerUrl(false)}/ws/friends/${session.user.id}/`
    setWs(new WebSocket(url))
  }, [session, ws])

  // Handling on message events
  useEffect(() => {
    if (!ws) return

    ws.addEventListener("message", onMessage)

    return () => {
      ws.removeEventListener("message", onMessage)
      ws.close()
    }
  }, [ws])

  function onMessage(e: MessageEvent<any>) {
    const data: Data = JSON.parse(e.data)
    console.log("new data --> ", data)
    setData(data)
  }

  if (!data) return <Loading basic center />

  return (
    <>
      <Header href="/" title="Friends List">
        <div className="absolute -top-1 right-0 flex gap-x-2">
          {/* Search for new friends */}
          <Link href="/friends/search">
            <Button className="relative">
              <FontAwesomeIcon icon={faUserPlus} />
            </Button>
          </Link>

          {/* Friend requests */}
          <Link href="/friends/requests">
            <Button className="relative text-xl">
              <FontAwesomeIcon icon={faBell} />
              {data.num_requests > 0 && (
                <div className="absolute -right-7 -top-4 h-7 w-7 rounded-full bg-red-400 text-lg">
                  <Center>{data.num_requests}</Center>
                </div>
              )}
            </Button>
          </Link>
        </div>
      </Header>

      {/* Friends list */}
      {data.friends.length !== 0 ? (
        <>
          <div className="mb-4 mt-2 grid grid-cols-5 border-b-2 pb-2 text-center text-xl">
            <p className="col-span-2">Name</p>
            <p>Chat</p>
            <p>Play</p>
            <p>Remove</p>
          </div>
          <div className="custom-scroll-bar flex h-full w-full flex-col gap-y-4">
            {data.friends.map((friend: FriendType) => (
              <FriendDetails key={friend.id} friend={friend} session={session!} />
            ))}
          </div>
        </>
      ) : (
        <p className="mt-4 text-center text-xl font-semibold">No friends :(</p>
      )}
    </>
  )
}
