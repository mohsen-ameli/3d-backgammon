import Head from "@/components/head"
import Container from "@/components/ui/Container"
import { ReactNode } from "react"

const metadata = {
  title: "3D Backgammon | Premium",
  description: "You can subscribe to buy skins, extra background, extra voice packs, and messages in game.",
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Container>
      <Head description={metadata.description} title={metadata.title} />
      {children}
    </Container>
  )
}
