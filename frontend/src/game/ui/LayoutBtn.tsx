import { ButtonHTMLAttributes } from "react"
import { Children } from "../../components/children.type"

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & Children

/**
 * Button component used in the layouts
 */
const LayoutBtn = ({ children, ...props }: BtnProps) => {
  return (
    <button
      className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-red-200 duration-200 ease-in-out hover:bg-red-300"
      {...props}
    >
      {children}
    </button>
  )
}

export default LayoutBtn
