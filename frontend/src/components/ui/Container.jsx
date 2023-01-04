const Container = ({ className, ...props }) => {
  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 w-[400px] h-[350px] p-4
        flex flex-col gap-y-8 rounded-md bg-[#cbd5e18f] ${className}`}
    >
      {props.children}
    </div>
  )
}

export default Container
