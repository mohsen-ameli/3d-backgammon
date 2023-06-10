import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"
import { CustomerResults } from "./customer.type"

export const dynamic = "force-dynamic"

/**
 * Searching for the current logged in user, to see if they are already a premium member.
 */
export async function GET() {
  const session = await getServerSession()

  if (!session) redirect("/signin?callbackUrl=/premium")

  const res = await fetch(`https://api.stripe.com/v1/customers/search?query=email:"${session.user.email}"`, {
    headers: {
      Authorization: "Basic " + btoa(process.env.STRIPE_SECRET_KEY! + ":"),
    },
    cache: "no-cache",
  })

  const data: CustomerResults = await res.json()

  let member = false

  if (data.data.length !== 0) {
    member = true
  }

  return NextResponse.json(member)
}
