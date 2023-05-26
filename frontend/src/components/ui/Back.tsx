"use client"

import { useRouter } from "next/navigation"
import Button from "./Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"

type BackProps = { href: string }

// Back button
export default function Back({ href }: BackProps) {
  const router = useRouter()

  function goBackTo() {
    router.push(href)
  }

  return (
    <div className="absolute -left-1 -top-1">
      <Button className="h-[35px] px-[8px]" onClick={goBackTo}>
        <div className="flex items-center gap-x-2">
          <FontAwesomeIcon icon={faArrowLeft} />
          <div>Back</div>
        </div>
      </Button>
    </div>
  )
}
