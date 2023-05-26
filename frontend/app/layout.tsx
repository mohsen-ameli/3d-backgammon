import Head from "@/components/head"
import AuthProvider from "@/wrappers/AuthProvider"
import "@/styles/global.css"
import { Analytics } from "@vercel/analytics/react"
import Toastify from "@/wrappers/Toastify"
import Layout from "@/next-three/Layout"
import { Josefin_Sans } from "next/font/google"
import OnlineStatus from "@/components/ui/OnlineStatus"
import { ReactNode } from "react"
import dynamic from "next/dynamic"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core"
import Loader from "@/components/ui/Loader"

// Adding font awesome everywhere
config.autoAddCss = false

const Experience = dynamic(() => import("@/game/Experience"), { ssr: false })
const MainLayout3D = dynamic(() => import("@/game/ui/layout/MainLayout3D"), { ssr: false })

const inter = Josefin_Sans({ subsets: ["latin"] })

const metadata = {
  title: "3D Backgammon | Home",
  description: "The home page for 3D Backgammon",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-gray-800 antialiased">
      <Head description={metadata.description} title={metadata.title} />
      <body className={inter.className}>
        <Analytics />
        <OnlineStatus />
        <Layout>
          <AuthProvider>
            {children}
            {/* @ts-ignore */}
            {/* <Experience /> */}
            {/* @ts-ignore */}
            {/* <MainLayout3D /> */}
            <Loader />
          </AuthProvider>
          <Toastify />
        </Layout>
      </body>
    </html>
  )
}
