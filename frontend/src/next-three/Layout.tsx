"use client"

import { ReactNode, useRef } from "react"
import dynamic from "next/dynamic"
const Scene = dynamic(() => import("@/next-three/Scene"), { ssr: false })

export default function Layout({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null!)

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: " 100%",
        height: "100%",
        overflow: "auto",
        touchAction: "auto",
      }}
    >
      {children}
      <Scene
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 20,
        }}
        eventSource={ref}
        eventPrefix="client"
      />
    </div>
  )
}

export { Layout }
