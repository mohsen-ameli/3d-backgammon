import { UIProps } from "../types/UI.type"

/**
 * Centers the children
 */
const Center = ({ className, children }: UIProps) => {
  return (
    <div
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${className}`}
    >
      {children}
    </div>
  )
}

export default Center
