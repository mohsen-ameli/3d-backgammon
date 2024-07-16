"use client"

import { ButtonHTMLAttributes, useState } from "react"
import { Children } from "@/types/children.type"

const clickAudio = typeof Audio !== "undefined" ? new Audio("/sounds/button-click.mp3") : null

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & Children

/**
 * Button component used in the layouts
 */
export default function LayoutBtn(props_: BtnProps) {
  const { children, onClick, ...props } = props_

  const [click] = useState(() => clickAudio)

  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    click?.play()
    onClick?.(e)
  }

  return (
    <button
      className="flex size-[40px] items-center justify-center rounded-full bg-red-200 text-sm outline-none duration-200 ease-in-out hover:bg-red-300 lg:size-[50px] lg:text-lg"
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}
