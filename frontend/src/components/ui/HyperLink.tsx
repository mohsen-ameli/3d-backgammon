"use client"

import { ButtonHTMLAttributes } from "react"

type HyperLinkProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href: string
  text: string
}

export default function HyperLink({ href, text, ...props }: HyperLinkProps) {
  function openNewTab() {
    const newWindow = window.open(href, "_blank", "noopener,noreferrer")
    if (newWindow) newWindow.opener = null
  }

  return (
    <button
      {...props}
      className={`text-orange-900 underline duration-150 ease-in-out hover:text-black ${props.className}`}
      onClick={openNewTab}
    >
      {text}
    </button>
  )
}
