"use client"

import { ReactNode, useRef } from "react"
import dynamic from "next/dynamic"
const Scene = dynamic(() => import("@/next-three/Scene"), { ssr: false })

export default function Layout({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null!)

  return (
    <div ref={ref} className="h-full w-full">
      {children}
      {/* @ts-ignore */}
      <Scene eventSource={ref} />
    </div>
  )
}
