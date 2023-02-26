import { InputHTMLAttributes } from "react"
import Input from "./Input"

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  name: string
  // type: string,
  // autoComplete: "on" | "off",
  // required: boolean,
  errors?: {
    message: string
    code: string
  } | null
}

/**
 * A form field with labels and inputs
 * @param {*} props -> Any other props to be attached to the input
 * @returns A nice input
 */
const FormField = (props: FormFieldProps) => {
  const { label, name, errors } = props
  // type = "text", autoComplete = "on", required = true

  return (
    <div className="relative flex flex-col">
      <label
        htmlFor={name}
        className="after:ml-1 after:text-xl after:text-red-500 after:content-['*']"
      >
        {label}
      </label>
      <Input
        id={name}
        // type={type}
        // autoComplete={autoComplete}
        // required={required}
        {...props}
      />
      {errors && errors.code === name && (
        <p className="text-sm text-red-500">{errors.message}</p>
      )}
    </div>
  )
}

export default FormField
