import Head from "@/components/head"
import Container from "@/components/ui/Container"
import { ReactNode } from "react"

const metadata = {
  title: "3D Backgammon | Friends",
  description: "Play games with your friends.",
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Container>
      <Head description={metadata.description} title={metadata.title} />
      {children}
    </Container>
  )
}
