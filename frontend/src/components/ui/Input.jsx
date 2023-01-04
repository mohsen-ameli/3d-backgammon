import { forwardRef } from "react"

const Input = forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      className={`px-2 py-3 outline-none rounded-lg focus:border-orange-400 ${className}`}
      type={type}
      ref={ref}
      {...props}
    />
  )
})

export default Input
