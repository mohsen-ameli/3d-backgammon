import { ReactNode } from "react"

// Metadata is handled in the page file
export default async function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
