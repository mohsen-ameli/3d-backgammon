"use client"

import SigninForm from "./SigninForm"
import { useRouter } from "next/navigation"
import { Suspense, useEffect } from "react"
import Header from "@/components/ui/Header"
import ProviderIcon from "@/components/ui/ProviderButton"
import { useSession } from "next-auth/react"

export default function SigninPage() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) router.push("/")
  }, [session])

  return (
    <>
      <Header href="/" title="Sign In" />

      <div className="flex size-full flex-col gap-4">
        <Suspense fallback={<div>Loading...</div>}>
          <SigninForm />
        </Suspense>

        <div className="mx-1 flex items-center text-black">
          <div className="grow border-t border-t-black"></div>
          <h1 className="mx-3 shrink">OR</h1>
          <div className="grow border-t border-t-black"></div>
        </div>

        <div className="flex justify-between gap-x-4 pb-4">
          <Suspense fallback={<div>Loading...</div>}>
            <ProviderIcon name="discord" iconOnly={true} />
            <ProviderIcon name="google" iconOnly={true} />
            <ProviderIcon name="twitch" iconOnly={true} />
          </Suspense>
        </div>
      </div>
    </>
  )
}
