import { forwardRef, InputHTMLAttributes } from "react"

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string
}

/**
 * A custom input
 */
const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, ...rest } = props

  return (
    <input
      className={`rounded-lg border-2 border-transparent px-2 py-2 outline-none 
                  duration-200 focus:border-orange-400 focus:ease-in-out ${className}`}
      ref={ref}
      {...rest}
    />
  )
})

export default Input
