"use client"

import notification from "@/components/utils/Notification"
import SigninForm from "./SigninForm"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import Header from "@/components/ui/Header"
import ProviderIcon from "@/components/ui/ProviderButton"
import { useSession } from "next-auth/react"

export default function SigninPage() {
  const { data: session } = useSession()
  const params = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    if (session) router.push("/")
  }, [session])

  useEffect(() => {
    if (params.get("error")) notification("You already have an account with that email!", "error")
  }, [params])

  return (
    <>
      <Header href="/" title="Sign In" />

      <div className="relative flex h-full w-full flex-col justify-around">
        <SigninForm />

        <div className="relative mx-1 flex items-center text-black">
          <div className="grow border-t border-t-black"></div>
          <h1 className="mx-3 shrink">OR</h1>
          <div className="grow border-t border-t-black"></div>
        </div>

        <div className="flex justify-between gap-x-4">
          <ProviderIcon name="discord" iconOnly={true} />
          <ProviderIcon name="google" iconOnly={true} />
          <ProviderIcon name="twitch" iconOnly={true} />
        </div>
      </div>
    </>
  )
}
