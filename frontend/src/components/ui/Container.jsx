import Center from "./Center"

const Container = ({ className, ...props }) => {
  return (
    <Center className="z-10">
      <div
        className={`w-[400px] h-[350px] p-4 flex flex-col
        rounded-md bg-[#cbd5e18f] ${className}`}
      >
        {props.children}
      </div>
    </Center>
  )
}

export default Container
