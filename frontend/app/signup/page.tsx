"use client"

import Button, { ButtonLoading } from "@/components/ui/Button"
import FormField from "@/components/ui/FormField"
import ImageUploader from "@/components/ui/ImageUploader"
import { ImageType } from "@/types/Image.type"
import Link from "next/link"
import { SyntheticEvent, useEffect, useState } from "react"
import signup from "./signup"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [btnClicked, setBtnClicked] = useState(false)
  const [image, setImage] = useState<ImageType>(null)
  const [errors, setErrors] = useState({ message: "", code: "" })
  const router = useRouter()

  // Clearing the clicked state when the errors change
  useEffect(() => {
    setBtnClicked(false)
  }, [errors])

  // Handling user submission
  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault()

    const target = e.target as typeof e.target & {
      username: { value: string }
      email: { value: string }
      password: { value: string }
      password2: { value: string }
    }

    // Get the username and password
    const username = target.username.value
    const email = target.email.value
    const password = target.password.value
    const password2 = target.password2.value

    // prettier-ignore
    if (username !== "" && email !== "" && password !== "" && password2 !== "") {
      setBtnClicked(true)
      
      // Register the user
      const success = await signup(username, email, password, password2, image, setErrors)
      if (success) {
        router.push("/signin")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4" autoComplete="on">
      <FormField errors={errors} required label="Username" name="username" placeholder="Username" />
      <FormField errors={errors} required label="Email" name="email" placeholder="Email" />
      <FormField errors={errors} required label="Password" name="password" type="password" placeholder="Password" />
      <FormField
        errors={errors}
        required
        label="Password (again)"
        name="password2"
        type="password"
        placeholder="Password Confirmation"
      />

      <div className="">
        <label htmlFor="image-input">Profile Picture (optional)</label>
        <ImageUploader image={image} setImage={setImage} />
      </div>

      <Button type="submit" className={"mt-3 w-full self-center"}>
        {btnClicked ? <ButtonLoading /> : "Sign Up"}
      </Button>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/signin" className="text-gray-600 duration-200 hover:text-white hover:ease-in-out">
          Sign In
        </Link>
      </div>
    </form>
  )
}
