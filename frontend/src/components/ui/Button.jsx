const Button = ({ className, ...props }) => {
  return (
    <button
      type="submit"
      className={
        "py-[6px] px-4 rounded-lg border-2 outline-none border-orange-800 hover:bg-gradient-to-r from-red-500 to-orange-500 " +
        className
      }
      {...props}
    >
      {props.children}
    </button>
  )
}

export default Button
