import Head from "@/components/head"
import { ReactNode } from "react"

const metadata = {
  title: "3D Backgammon | Credits",
  description: "Thanks to all of you, I was able to make this website happen :)",
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head description={metadata.description} title={metadata.title} />
      {children}
    </>
  )
}
