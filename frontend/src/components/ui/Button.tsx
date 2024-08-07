"use client"

import { ButtonHTMLAttributes, useState } from "react"
import { twMerge } from "tailwind-merge"

type InputProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  filled?: boolean
}

/**
 * A button that has a somewhat cool hover effect
 */
const clickAudio = typeof Audio !== "undefined" ? new Audio("/sounds/button-click.mp3") : null

export default function Button(props: InputProps) {
  const { className, onClick, children, disabled, filled, ...rest } = props

  const buttonClassName = twMerge(
    `group relative h-10 rounded-lg border-2 border-orange-800 px-4 outline-none ${
      disabled && "cursor-not-allowed"
    } ${className}`,
  )

  let bgClassName

  if (!filled) {
    bgClassName = twMerge(
      `absolute inset-0 z-10 rounded-md bg-gradient-to-b from-red-500 to-orange-500 opacity-0 transition duration-75 ${
        disabled ? "" : "group-hover:opacity-100"
      }`,
    )
  } else {
    bgClassName = twMerge(
      `absolute inset-0 z-10 rounded-md bg-gradient-to-b from-red-500 to-orange-500 transition duration-75 ${
        disabled ? "" : "group-hover:ease-in-out group-hover:from-red-700 group-hover:to-orange-700"
      }`,
    )
  }

  const [click] = useState(() => clickAudio)

  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (disabled) return
    click?.play()
    onClick?.(e)
  }

  return (
    <button type="submit" className={buttonClassName} onClick={handleClick} {...rest}>
      <div className="relative z-20">{children}</div>
      <div className={bgClassName} />
    </button>
  )
}

export const ButtonLoading = () => {
  return (
    <svg
      className="mx-auto size-5 animate-spin text-blue-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
}
