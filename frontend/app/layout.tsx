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
import FakeLoader from "@/components/ui/FakeLoader"
import ReactQuery from "@/wrappers/ReactQuery"
import Tutorial from "@/components/ui/Tutorial"

// Adding font awesome everywhere
config.autoAddCss = false

const Experience = dynamic(() => import("@/game/Experience"), { ssr: false })
const MainLayout3D = dynamic(() => import("@/game/ui/layout/MainLayout3D"), { ssr: false })
const Loader = dynamic(() => import("@/components/ui/Loader"), {
  ssr: false,
  loading: () => <FakeLoader />,
})

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
        <Analytics debug={false} />
        <OnlineStatus />
        <Loader />
        <Layout>
          <AuthProvider>
            <ReactQuery>
              {children}
              <Experience />
              <MainLayout3D />
              {/* <Tutorial /> */}
            </ReactQuery>
          </AuthProvider>
          <Toastify />
        </Layout>
      </body>
    </html>
  )
}
