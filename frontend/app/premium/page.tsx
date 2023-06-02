import Header from "@/components/ui/Header"
import { faStarOfLife } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function PremiumPage() {
  const session = await getServerSession()

  if (!session) redirect("/signin?callbackUrl=/premium")

  return (
    <div>
      <Header href="/" title="Premium Subscription" />
      <FontAwesomeIcon icon={faStarOfLife} />
    </div>
  )
}
