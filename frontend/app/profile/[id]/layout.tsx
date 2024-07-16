import { authOptions } from "@/api/auth/[...nextauth]"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Metadata } from "next"
import { ReactNode } from "react"
import Head from "@/components/head"
import Container from "@/components/ui/Container"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/signin?callbackUrl=/")

  const { user } = session

  return {
    title: `3D Backgammon | ${user.name}`,
    description: `The profile page for ${user.name}.`,
  }
}

export default async function layout({ children }: { children: ReactNode }) {
  const metadata = await generateMetadata()

  return (
    <Container>
      <Head description={metadata.description as string} title={metadata.title as string} />
      {children}
    </Container>
  )
}
