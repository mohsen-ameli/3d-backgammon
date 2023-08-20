import { authOptions } from "@/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import Image from "next/image"
import { redirect } from "next/navigation"
import React from "react"
import { ProfileData } from "@/types/Profile.type"
import AxiosInstance from "@/components/utils/AxiosInstance"
import Header from "@/components/ui/Header"
import axios from "axios"
import getServerUrl from "@/components/utils/getServerUrl"

export const revalidate = 30

export async function generateStaticParams() {
  const { data }: { data: number[] } = await axios.get(getServerUrl() + "/api/get-user-ids/")
  return data.map(id => ({ id: id.toString() }))
}

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect(`/signin?callbackUrl=/`)

  const axiosInstance = AxiosInstance(session)
  const { data }: { data: ProfileData } = await axiosInstance.get(`/api/get-user-profile/${params.id}`)

  return (
    <>
      <Header href="/" title="Profile" />

      <div className="flex flex-col items-center justify-center gap-y-2">
        <div className="relative h-[80px] w-[80px] xl:h-[100px] xl:w-[100px]">
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
