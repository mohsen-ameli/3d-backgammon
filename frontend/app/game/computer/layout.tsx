import Head from "@/components/head"
import { ReactNode } from "react"

const metadata = {
  title: "3D Backgammon | VS Computer",
  description: "Play backgammon against an AI.",
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head description={metadata.description} title={metadata.title} />
      {children}
    </>
  )
}
