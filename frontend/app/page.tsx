"use client"

import Button3d from "@/components/ui/3d-button/Button3d"
import HyperLink from "@/components/ui/HyperLink"
import Logout from "@/components/ui/Logout"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useGameStore } from "@/game/store/useGameStore"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Modal from "@/components/ui/Modal"
import Button from "@/components/ui/Button"

export default function Page() {
  const started = useGameStore(state => state.started)
  const { status, data: session } = useSession()
  const router = useRouter()

  const [openPlay, setOpenPlay] = useState(false)

  useEffect(() => {
    if (session) router.push("/")
  }, [session])

  if (!started) return <></>

  return (
    <>
      {/* The half circle at the bottom */}
      <div className="fixed bottom-[-35%] z-20 h-[65%] w-full rounded-t-[50%] bg-[#ffffffac]" />

      {/* Buttons */}
      <div className="absolute flex size-full items-end justify-around overflow-y-hidden">
        {status === "authenticated" ? (
          <>
            <Logout />
            <Link href={`/profile/${session.user.id}`} className="z-20 mb-[15%] sm:mb-[10%] xl:mb-[7%]">
              <Button3d text="Profile" />
            </Link>
            <Link href="/friends" className="z-20 mb-[15%] sm:mb-[10%] xl:mb-[7%]">
              <Button3d text="Friends" />
            </Link>
          </>
        ) : (
          <>
            <Link href="/signin" className="z-20 mb-[13%] sm:mb-[6%] xl:mb-[4%]">
              <Button3d text="Sign In" />
            </Link>
            <Link href="/signup" className="z-20 mb-[22%] sm:mb-[13%] xl:mb-[6%]">
              <Button3d text="Sign Up" />
            </Link>
          </>
        )}
        <Modal open={openPlay} setOpen={setOpenPlay} className="min-w-[400px]">
          <div className="my-4 flex w-full flex-col gap-4">
            <Button filled onClick={() => router.push("/game/pass-and-play")}>
              Pass and Play
            </Button>
            <Button filled onClick={() => router.push("/game/computer")} className="px-0">
              <div className="flex w-full justify-center">Play VS Computer</div>
            </Button>
          </div>
        </Modal>
        <div
          className={`z-20 ${status === "authenticated" ? "mb-[6%] sm:mb-[4%]" : "mb-[13%] sm:mb-[6%] xl:mb-[4%]"}`}
          onClick={() => setOpenPlay(curr => !curr)}
        >
          <Button3d text="Play" />
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-5 z-20 flex w-full items-center justify-center gap-x-2 text-sm text-black lg:text-lg">
        <Link href="/credits" className="text-orange-900 underline duration-150 ease-in-out hover:text-black">
          Credits
        </Link>
        <span className="text-orange-900">•</span>
        <HyperLink href="https://www.mohsenameli.com/" text="About Me" />
      </div>
    </>
  )
}
