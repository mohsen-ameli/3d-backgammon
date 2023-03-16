import { UIProps } from "../types/UI.type"
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
        className={`custom-scroll-bar flex max-h-[400px] min-h-[350px] w-[400px] flex-col rounded-md bg-[#cbd5e1c0]
        p-4 sm:max-h-[350px] lg:max-h-[400px] xl:max-h-[500px] ${className}`}
      >
        {children}
      </div>
    </Center>
  )
}

export default Container
