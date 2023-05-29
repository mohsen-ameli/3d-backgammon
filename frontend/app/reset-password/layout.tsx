import Head from "@/components/head"
import Container from "@/components/ui/Container"
import "@/styles/global.css"
import { ReactNode } from "react"

const metadata = {
  title: "3D Backgammon | Reset Password",
  description: "Reset your account's password.",
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head description={metadata.description} title={metadata.title} />
      <Container>{children}</Container>
    </>
  )
}
