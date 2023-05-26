import { InputHTMLAttributes, forwardRef } from "react"

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string
}

/**
 * A custom input
 */
export default forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  const { className, ...rest } = props

  return (
    <input
      className={`rounded-lg border-2 border-transparent p-2 outline-none duration-200 
                focus:border-orange-400 focus:ease-in-out ${className}`}
      ref={ref}
      {...rest}
    />
  )
})
