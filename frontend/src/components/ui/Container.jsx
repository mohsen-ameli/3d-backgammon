const Container = (props) => {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 w-[400px] h-[350px] p-4
        flex flex-col justify-between gap-y-8 rounded-md bg-[#cbd5e18f]"
    >
      {props.children}
    </div>
  )
}

export default Container
