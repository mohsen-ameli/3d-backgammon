"use client"

import Header from "@/components/ui/Header"
import Image from "next/image"
import { redirect } from "next/navigation"
import React, { useEffect, useState } from "react"
import { ProfileData } from "@/types/Profile.type"
import AxiosInstance from "@/components/utils/AxiosInstance"
import { useSession } from "next-auth/react"

// export const dynamic = "force-static"

export default function ProfilePage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin?callbackUrl=/profile")
    },
  })

  const axiosInstance = AxiosInstance(session!)

  const [data, setData] = useState<ProfileData>()

  useEffect(() => {
    async function fetchStuff() {
      const { data }: { data: ProfileData } = await axiosInstance.get("/api/get-user-profile/")
      setData(data)
    }

    if (session) fetchStuff()
  }, [axiosInstance, session])

  if (!data || !session) return <></>

  return (
    <>
      <Header href="/" title="Profile" />

      <div className="flex flex-col items-center justify-center gap-y-2">
        <div className="relative size-[80px] xl:size-[100px]">
          <Image fill alt={session.user.name} src={session.user.image} className="inline-block rounded-full" />
        </div>
        <h1 className="text-lg">{session.user.name}</h1>
        <p className="text-center text-lg">A member since {getDateJoined(data.date_joined)}</p>
      </div>

      <div className="my-4 w-full border-b-2 border-blue-400"></div>

      <div className="flex flex-col items-center gap-y-2 text-lg">
        {data.total_games > 0 ? (
          <>
            <p>
              Games won: {data.games_won} / {data.total_games} or {getAvgGames(data.games_won, data.total_games)}%
            </p>
            <p>
              Games lost: {data.games_lost} / {data.total_games} or {getAvgGames(data.games_lost, data.total_games)}%
            </p>
            <p>Total Games: {data.total_games}</p>
          </>
        ) : (
          <p>No games played yet</p>
        )}
      </div>
    </>
  )
}

function getAvgGames(portion: number, total: number) {
  if (portion === 0) return 0
  return Math.round((portion / total) * 100)
}

function getDateJoined(joined: number) {
  const date = new Date(joined * 1000)
  return new Intl.DateTimeFormat("default", {
    dateStyle: "long",
  }).format(date)
}
