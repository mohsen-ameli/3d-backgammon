import Head from "@/components/head"
import { ReactNode } from "react"

const metadata = {
  title: "3D Backgammon | Pass & Play",
  description: "Play backgammon with your friends, using one device.",
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head description={metadata.description} title={metadata.title} />
      {children}
    </>
  )
}
