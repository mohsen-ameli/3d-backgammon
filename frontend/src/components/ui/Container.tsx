import { UIProps } from "./UI.type"
import Center from "./Center"

/**
 * Container for all pages
 * @param {*} props -> Any other props to be attached to the button
 * @returns The children
 */
const Container = ({ className, children }: UIProps) => {
  return (
    <Center className="z-10">
      <div
        className={`custom-scroll-bar flex h-[350px] w-[400px] flex-col rounded-md
        bg-[#cbd5e18f] p-4 ${className}`}
      >
        {children}
      </div>
    </Center>
  )
}

export default Container
