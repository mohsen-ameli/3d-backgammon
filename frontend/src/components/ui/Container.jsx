import Center from "./Center"

/**
 * Container for all pages
 * @param {*} className -> Extra classNames
 * @param {*} props -> Any other props to be attached to the button
 * @returns The children
 */
const Container = ({ className, ...props }) => {
  return (
    <Center className="z-10">
      <div
        className={`w-[400px] h-[350px] p-4 flex flex-col custom-scroll-bar
        rounded-md bg-[#cbd5e18f] ${className}`}
      >
        {props.children}
      </div>
    </Center>
  )
}

export default Container
