import { ButtonHTMLAttributes, useState } from "react"
import { Children } from "../../components/types/children.type"
import buttonClick from "../../assets/sounds/button-click.mp3"

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & Children

/**
 * Button component used in the layouts
 */
const LayoutBtn = (props_: BtnProps) => {
  const { children, onClick, ...props } = props_

  const [click] = useState(() => new Audio(buttonClick))

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    click.play()
    onClick?.(e)
  }

  return (
    <button
      className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-red-200 text-sm outline-none duration-200 ease-in-out hover:bg-red-300 lg:h-[50px] lg:w-[50px] lg:text-lg"
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default LayoutBtn
