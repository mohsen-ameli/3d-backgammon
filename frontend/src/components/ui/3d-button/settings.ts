export const transition = {
  type: "spring",
  duration: 0.7,
  bounce: 0.2,
}

export const spring = { stiffness: 600, damping: 30 }

export const mouseToLightRotation = (v: number) => (-1 * v) / 140
