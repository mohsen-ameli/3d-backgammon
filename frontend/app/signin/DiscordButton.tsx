"use client"

import Button from "@/components/ui/Button"
import { faDiscord } from "@fortawesome/free-brands-svg-icons/faDiscord"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"

export default function DiscordButton() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ? searchParams.get("callbackUrl") : "/"

  return (
    <Button onClick={() => signIn("discord", { callbackUrl: callbackUrl! })}>
      <div className="flex w-full items-center justify-center gap-x-8">
        <FontAwesomeIcon icon={faDiscord} size="xl" color="white" />
        <h1>Continue with Discord</h1>
      </div>
    </Button>
  )
}
