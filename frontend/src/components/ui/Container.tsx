import { animated, useSpring } from "@react-spring/web"
import { MouseEvent, useRef } from "react"
import { isMobile } from "react-device-detect"
import { UIProps } from "../types/UI.type"

const calc = (x: number, y: number, rect: DOMRect) => [
  -(y - rect.top - rect.height / 2) / 70,
  (x - rect.left - rect.width / 2) / 70,
  1.01,
]

const trans = (x: number, y: number, s: number) =>
  `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`

const config = {
  mass: 1,
  tension: 170,
  friction: 26,
  clamp: false,
  precision: 0.001,
  velocity: 0,
}

/**
 * Container for all pages
 * @param {*} props -> Any other props to be attached to the button
 * @returns The children
 */
const Container = ({ className, children }: UIProps) => {
  const cardRef = useRef<HTMLDivElement>(null!)

  const [{ xys }, api] = useSpring(() => ({ xys: [0, 0, 1], config }), [config])

  const handleMouseLeave = () =>
    api.start({
      xys: [0, 0, 1],
    })

  const handleMouseMove = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    const rect = cardRef.current.getBoundingClientRect()
    api.start({
      xys: calc(e.clientX, e.clientY, rect),
    })
  }

  return (
    <animated.div
      className={`custom-scroll-bar flex flex-col rounded-md bg-[#cbd5e1c0] p-4 ${className}`}
      ref={cardRef}
      style={{
        // @ts-ignore
        transform: !isMobile && xys.to(trans),
        boxShadow: "0px 0px 10px 1px #853f0d75",
      }}
      id="container"
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {children}
    </animated.div>
  )
}

export default Container
