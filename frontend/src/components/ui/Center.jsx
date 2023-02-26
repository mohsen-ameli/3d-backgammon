/**
 * Centers the children
 * @param {*} className -> Extra classNames
 * @returns The children
 */
const Center = ({ className, ...props }) => {
  return (
    <div
      className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 ${className}`}
    >
      {props.children}
    </div>
  )
}

export default Center
