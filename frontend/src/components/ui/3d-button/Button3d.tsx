"use client"

/**
 * taken from:
 * https://codesandbox.io/s/framer-motion-3d-shapes-button-ke8wx?from-embed
 */

import { MotionConfig, motion, useMotionValue } from "framer-motion"
import { memo, useState } from "react"
import useMeasure from "react-use-measure"
import * as types from "@/types/3d-button.types"
import Shapes from "./Shapes"
import { transition } from "./settings"
import "@/styles/button3d.css"
import Loading from "@/next-three/CanvasLoading"
import dynamic from "next/dynamic"

const View = dynamic(() => import("@/next-three/View").then(mod => mod.View), {
  ssr: false,
  loading: () => <Loading />,
})

const clickAudio = typeof Audio !== "undefined" ? new Audio("/sounds/button-click.mp3") : null

export default function Button3d({ text, ...props }: types.Button3dProps) {
  const [ref, bounds] = useMeasure({ scroll: false })
  const [isHover, setIsHover] = useState(false)
  const [isPress, setIsPress] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const [click] = useState(() => clickAudio)
  const [label] = useState(() => text)

  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    click?.play()
    props.onClick?.(e)
  }

  function resetMousePosition() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <MotionConfig transition={transition}>
      <motion.button
        className={"btn-3d " + props.className}
        onClick={handleClick}
        ref={ref}
        initial={false}
        animate={isHover ? "hover" : "rest"}
        whileTap="press"
        variants={{
          rest: { scale: 1 },
          hover: { scale: 1.5 },
          press: { scale: 1.4 },
        }}
        onHoverStart={() => {
          resetMousePosition()
          setIsHover(true)
        }}
        onHoverEnd={() => {
          resetMousePosition()
          setIsHover(false)
        }}
        onTapStart={() => setIsPress(true)}
        onTap={() => setIsPress(false)}
        onTapCancel={() => setIsPress(false)}
        onPointerMove={e => {
          mouseX.set(e.clientX - bounds.x - bounds.width / 2)
          mouseY.set(e.clientY - bounds.y - bounds.height / 2)
        }}
      >
        <motion.div
          className="shapes"
          variants={{
            rest: { opacity: 0.3 },
            hover: { opacity: 1 },
          }}
        >
          <div className="pink blush" />
          <div className="blue blush" />
          {/* @ts-ignore */}
          <View className="container z-10 rounded-full">
            <Shapes text={label} isHover={isHover} isPress={isPress} mouseX={mouseX} mouseY={mouseY} />
          </View>
        </motion.div>
        <motion.h1 variants={{ hover: { scale: 1.5 }, press: { scale: 1.1 } }} className="label">
          {text}
        </motion.h1>
      </motion.button>
    </MotionConfig>
  )
}
