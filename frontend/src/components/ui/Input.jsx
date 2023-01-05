import { forwardRef } from "react"

const Input = forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      className={`px-2 py-2 outline-none rounded-lg border-2 border-transparent focus:border-orange-400 focus:ease-in-out duration-200 ${className}`}
      type={type}
      ref={ref}
      {...props}
    />
  )
})

export default Input
