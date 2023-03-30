import { UIProps } from "../types/UI.type"

/**
 * Container for all pages
 * @param {*} props -> Any other props to be attached to the button
 * @returns The children
 */
const Container = ({ className, children }: UIProps) => {
  return (
    <div
      className={`custom-scroll-bar flex flex-col rounded-md bg-[#cbd5e1c0] p-4 ${className}`}
      id="container"
    >
      {children}
    </div>
  )
}

export default Container
