"use client"

import notification from "@/components/utils/Notification"
import DiscordButton from "./DiscordButton"
import SigninForm from "./SigninForm"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import Header from "@/components/ui/Header"

export default function SigninPage(props: { searchParams: { error: string } }) {
  const params = useSearchParams()

  useEffect(() => {
    if (params.get("error")) notification("You already have an account with that email!", "error")
  }, [params])

  return (
    <>
      <Header href="/" title="Sign In" />

      <div className="flex h-full w-full flex-col">
        <SigninForm />

        <div className="relative mx-1 mb-2 flex items-center text-black">
          <div className="grow border-t border-t-black"></div>
          <h1 className="mx-3 shrink">OR</h1>
          <div className="grow border-t border-t-black"></div>
        </div>

        <DiscordButton />
      </div>
    </>
  )
}
