"use client"

import Button, { ButtonLoading } from "@/components/ui/Button"
import FormField from "@/components/ui/FormField"
import { ErrorType } from "@/types/User.type"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useState } from "react"

export default function SigninForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ? searchParams.get("callbackUrl") : "/"

  const [errors, setErrors] = useState<ErrorType>()
  const [clicked, setClicked] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setClicked(true)

    const { username, password } = e.target as typeof e.target & {
      username: { value: string }
      password: { value: string }
    }

    const res = await signIn("credentials", {
      username: username.value,
      password: password.value,
      redirect: false,
    })

    if (!res?.error) {
      router.push(callbackUrl!)
    } else {
      setErrors({
        code: "password",
        message: "Either the username or password is wrong.",
      })
      setClicked(false)
    }
  }

  return (
    <form className="flex w-full flex-col justify-around gap-y-2" onSubmit={handleSubmit} autoComplete="on">
      <FormField required label="Username" name="username" placeholder="Username" />
      <FormField errors={errors} required label="Password" name="password" type="password" placeholder="Password" />

      <div className="flex justify-between">
        <Link
          href="/reset-password"
          className="w-fit text-sm text-gray-800 duration-200 hover:text-gray-100 hover:ease-in-out"
        >
          Reset password?
        </Link>

        <Link href="/signup" className="w-fit text-sm text-gray-800 duration-200 hover:text-gray-100 hover:ease-in-out">
          Don&apos;t have an account?
        </Link>
      </div>

      <Button disabled={clicked} type="submit" className="w-full">
        {clicked ? <ButtonLoading /> : "Continue with Email"}
      </Button>
    </form>
  )
}
