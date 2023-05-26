"use client"

import { InputHTMLAttributes, useEffect, useRef, useState } from "react"
import Input from "./Input"
import Image from "next/image"
import { ErrorType } from "@/types/User.type"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  name: string
  mandatory?: boolean
  errors?: ErrorType
}

/**
 * A form field with labels and inputs
 * @returns A nice input
 */
export default function FormField(props: FormFieldProps) {
  const { label, name, errors, mandatory = true } = props

  const ref = useRef<HTMLDivElement>(null)

  const [show, setShow] = useState(false)
  const [type, setType] = useState(props.type)
  const toggle = () => setShow(curr => !curr)

  useEffect(() => {
    if (name === "password" || name === "password2") {
      setType(show ? "text" : "password")
    }
  }, [name, show])

  // Scroll to the error field
  useEffect(() => {
    if (errors && errors.code === name) {
      ref.current?.scrollIntoView()
      // notification("There were errors when signing you up.", "error")
    }
  }, [errors, name])

  return (
    <div className="relative flex flex-col" ref={ref}>
      <label
        htmlFor={name}
        className={"after:ml-1 after:text-xl " + (mandatory && "after:text-red-500 after:content-['*']")}
      >
        {label}
      </label>
      <div className="relative flex">
        <Input className="flex-1" id={name} {...props} type={type} />

        {/* See password */}
        {(name === "password" || name === "password2") && <Eyeball show={show} toggle={toggle} />}
      </div>

      {/* Errors */}
      {errors && errors.code === name && <p className="text-sm text-red-500">{errors.message}</p>}
    </div>
  )
}

type EyeballProps = {
  show: boolean
  toggle: () => void
}

function Eyeball({ show, toggle }: EyeballProps) {
  return (
    <div className="absolute right-4 top-1/2 w-[20px] -translate-y-1/2 cursor-pointer pt-[6px] text-center text-black duration-100 hover:text-slate-500 hover:ease-in-out">
      {show ? (
        <FontAwesomeIcon icon={faEye} onClick={toggle} />
      ) : (
        <FontAwesomeIcon icon={faEyeSlash} onClick={toggle} />
      )}
    </div>
  )
}
