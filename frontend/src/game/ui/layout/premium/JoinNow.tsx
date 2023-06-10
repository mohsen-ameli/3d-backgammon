"use client"

import Button, { ButtonLoading } from "@/components/ui/Button"
import getStripe from "./get-stripe"
import { useEffect, useState } from "react"
import notification from "@/components/utils/Notification"
import axios from "axios"
import { useSession } from "next-auth/react"

export default function JoinNow() {
  const { data: session } = useSession()
  const [member, setMember] = useState<boolean | null>(null)

  useEffect(() => {
    getUser()
  }, [])

  async function getUser() {
    const { data: user }: { data: boolean } = await axios.get("/api/stripe")
    setMember(user)
  }

  async function checkout() {
    if (!session) return
    if (member) {
      notification("Wohoo, you're a member!")
      return
    }

    const stripe = await getStripe()

    const { error } = await stripe!.redirectToCheckout({
      lineItems: [{ price: process.env.NEXT_PUBLIC_PRICE!, quantity: 1 }],
      mode: "subscription",
      successUrl: process.env.NEXT_PUBLIC_HTTP_SERVER!,
      cancelUrl: process.env.NEXT_PUBLIC_HTTP_SERVER!,
      customerEmail: session.user.email,
    })

    if (error) {
      notification(error.message ? error.message : "Something went wrong! Please try again later.", "error")
    }
  }

  return (
    <Button onClick={checkout} type="submit" className="px-0" disabled={member === null}>
      {member === null ? <ButtonLoading /> : member ? "Already a Member" : "Join Now!"}
    </Button>
  )
}
