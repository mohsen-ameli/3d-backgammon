"use client"

import notification from "@/components/utils/Notification"
import SigninForm from "./SigninForm"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import Header from "@/components/ui/Header"
import ProviderIcon from "@/components/ui/ProviderButton"

export default function SigninPage() {
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

        <div className="flex justify-between gap-x-4 pb-4">
          <ProviderIcon name="discord" iconOnly={true} />
          <ProviderIcon name="google" iconOnly={true} />
          <ProviderIcon name="facebook" iconOnly={true} />
        </div>
      </div>
    </>
  )
}
