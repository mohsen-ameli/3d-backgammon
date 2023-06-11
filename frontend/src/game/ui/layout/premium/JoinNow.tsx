"use client"

import Button, { ButtonLoading } from "@/components/ui/Button"
import getStripe from "./get-stripe"
import notification from "@/components/utils/Notification"
import { useSession } from "next-auth/react"

export default function JoinNow() {
  const { data: session } = useSession()

  async function checkout() {
    if (!session) return
    if (session.user.premium) {
      notification("Wohoo, you're a member!")
      return
    }

    const stripe = await getStripe()

    const { error } = await stripe!.redirectToCheckout({
      lineItems: [{ price: process.env.NEXT_PUBLIC_PRICE!, quantity: 1 }],
      mode: "subscription",
      successUrl: window?.location.href,
      cancelUrl: window?.location.href,
      customerEmail: session.user.email,
    })

    if (error) {
      notification(error.message ? error.message : "Something went wrong! Please try again later.", "error")
    }
  }

  return (
    <Button onClick={checkout} type="submit" className="px-0" disabled={session === null}>
      {session === null ? <ButtonLoading /> : session.user.premium ? "Already a Member" : "Join Now!"}
    </Button>
  )
}
