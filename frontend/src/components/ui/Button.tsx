import { ButtonHTMLAttributes, useState } from "react"
import buttonClick from "/sounds/button-click.mp3"

type InputProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string
}

/**
 * A button that has a somewhat cool hover effect
 */
const Button = (props: InputProps) => {
  const { className, onClick, children, disabled, ...rest } = props

  const [click] = useState(() => new Audio(buttonClick))

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (disabled) return
    click.play()
    onClick?.(e)
  }

  return (
    <button
      type="submit"
      className={`group relative h-10 rounded-lg border-2 border-orange-800 px-4 outline-none
      ${disabled && "cursor-not-allowed"} ${className}`}
      onClick={handleClick}
      {...rest}
    >
      <div className="relative z-20">{children}</div>
      <div
        className={`absolute inset-0 z-10 rounded-md opacity-0 transition duration-200 group-hover:opacity-100
      ${disabled ? "" : "bg-gradient-to-b from-red-500 to-orange-500"}`}
      ></div>
    </button>
  )
}

export const ButtonLoading = () => {
  return (
    <svg
      className="mx-auto h-5 w-5 animate-spin text-blue-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
}

export default Button
