import Head from "@/components/head"
import Header from "@/components/ui/Header"
import { ReactNode } from "react"

const metadata = {
  title: "3D Backgammon | Search Friends",
  description: "Search for new friends, using their email or username.",
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head description={metadata.description} title={metadata.title} />
      <Header href="/friends" title="Add a Friend" />
      {children}
    </>
  )
}
