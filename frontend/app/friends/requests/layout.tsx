import Head from "@/components/head"
import { ReactNode } from "react"

const metadata = {
  title: "3D Backgammon | Friend Requests",
  description: "Accept or reject your current friend requests.",
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head description={metadata.description} title={metadata.title} />
      {children}
    </>
  )
}
