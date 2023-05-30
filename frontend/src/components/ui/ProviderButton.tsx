"use client"

import toCapitalize from "@/components/utils/ToCapitalize"
import { ProvidersType } from "@/types/User.type"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons"
import { faDiscord } from "@fortawesome/free-brands-svg-icons/faDiscord"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"

export default function ProviderIcon({ name, iconOnly = false }: { name: ProvidersType; iconOnly?: boolean }) {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ? searchParams.get("callbackUrl") : "/"

  let className =
    "w-full group relative h-10 rounded-lg border-2 px-4 outline-none duration-100 hover:text-white hover:ease-in-out "
  let icon = faFacebook

  if (name === "discord") {
    className += "border-[#7289da] hover:bg-[#7289da]"
    icon = faDiscord
  } else if (name === "facebook") {
    className += "border-[#3b5998] hover:bg-[#3b5998]"
    icon = faFacebook
  } else if (name === "google") {
    className += "border-[#4285F4] hover:bg-[#4285F4]"
    icon = faGoogle
  }

  return (
    <div className="w-full">
      <button className={className} onClick={() => signIn(name, { callbackUrl: callbackUrl! })}>
        <div className="flex w-full items-center justify-center gap-x-8">
          <FontAwesomeIcon
            icon={icon}
            size="xl"
            className="text-[#36393e] duration-100 group-hover:text-white group-hover:ease-in-out"
          />
          {!iconOnly && <h1>Continue with {toCapitalize(name)}</h1>}
        </div>
      </button>
    </div>
  )
}
