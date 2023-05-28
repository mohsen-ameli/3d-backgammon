import Head from "@/components/head"
import Header from "@/components/ui/Header"
import { ReactNode } from "react"

const metadata = {
  title: "3D Backgammon | Friend Requests",
  description: "Accept or reject your current friend requests.",
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head description={metadata.description} title={metadata.title} />
      <Header href="/friends" title="Friend Requests" />
      {children}
    </>
  )
}
