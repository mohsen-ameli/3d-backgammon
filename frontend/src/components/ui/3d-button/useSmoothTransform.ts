"use client"

import { MotionValue, SpringOptions, useSpring, useTransform } from "framer-motion"

export function useSmoothTransform(
  value: MotionValue<number>,
  springOptions: SpringOptions,
  transformer: (XY: number) => number,
) {
  return useSpring(useTransform(value, transformer), springOptions)
}
