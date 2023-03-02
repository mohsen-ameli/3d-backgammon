import { InputHTMLAttributes } from "react"
import Input from "./Input"

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  name: string
  errors?: {
    message: string
    code: string
  } | null
}

/**
 * A form field with labels and inputs
 * @returns A nice input
 */
const FormField = (props: FormFieldProps) => {
  const { label, name, errors } = props

  return (
    <div className="relative flex flex-col">
      <label
        htmlFor={name}
        className="after:ml-1 after:text-xl after:text-red-500 after:content-['*']"
      >
        {label}
      </label>
      <Input id={name} {...props} />
      {errors && errors.code === name && (
        <p className="text-sm text-red-500">{errors.message}</p>
      )}
    </div>
  )
}

export default FormField
