import { InputHTMLAttributes, useEffect, useRef, useState } from "react"
import notification from "../utils/Notification"
import Input from "./Input"

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  name: string
  mandatory?: boolean
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
  const { label, name, errors, mandatory = true } = props

  const ref = useRef<HTMLDivElement>(null)

  const [show, setShow] = useState(false)
  const [type, setType] = useState(props.type)
  const toggle = () => setShow(curr => !curr)

  useEffect(() => {
    if (name === "password" || name === "password2") {
      setType(show ? "text" : "password")
    }
  }, [show])

  // Scroll to the error field
  useEffect(() => {
    if (errors && errors.code === name) {
      ref.current?.scrollIntoView()
      // notification("There were errors when signing you up.", "error")
    }
  }, [errors])

  return (
    <div className="relative flex flex-col" ref={ref}>
      <label
        htmlFor={name}
        className={
          "after:ml-1 after:text-xl " +
          (mandatory && "after:text-red-500 after:content-['*']")
        }
      >
        {label}
      </label>
      <Input id={name} {...props} type={type} />

      {/* See password */}
      {(name === "password" || name === "password2") && (
        <Eyeball show={show} toggle={toggle} />
      )}

      {/* Errors */}
      {errors && errors.code === name && (
        <p className="text-sm text-red-500">{errors.message}</p>
      )}
    </div>
  )
}

type EyeballProps = {
  show: boolean
  toggle: () => void
}

const Eyeball = ({ show, toggle }: EyeballProps) => {
  return (
    <div className="absolute right-3 bottom-2 h-[30px] w-[30px] cursor-pointer pt-[6px] text-center text-black duration-100 hover:text-slate-500 hover:ease-in-out">
      {!show ? (
        <i className="fa-regular fa-eye" onClick={toggle}></i>
      ) : (
        <i className="fa-regular fa-eye-slash" onClick={toggle}></i>
      )}
    </div>
  )
}

export default FormField
