"use client"

import { forwardRef, HTMLAttributes, ReactNode, useImperativeHandle, useRef } from "react"
import { View as ViewImpl } from "@react-three/drei"
import { Three } from "@/next-three/Three"

type ViewProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  orbit?: boolean
}

const View = forwardRef(({ children, ...props }: ViewProps, ref) => {
  const localRef = useRef<HTMLDivElement>(null!)
  useImperativeHandle(ref, () => localRef.current)

  return (
    <>
      <div ref={localRef} {...props} />
      <Three>
        <ViewImpl track={localRef}>{children}</ViewImpl>
      </Three>
    </>
  )
})
View.displayName = "View"

export { View }
