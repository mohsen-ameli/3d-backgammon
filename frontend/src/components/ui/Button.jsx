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

export const ButtonLoading = () => {
  return (
    <svg
      className="animate-spin mx-auto h-5 w-5 text-blue-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
}

export default Button
