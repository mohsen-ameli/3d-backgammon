const Button = ({ className, ...props }) => {
  return (
    <button
      type="submit"
      class={
        "relative group w-32 h-10 rounded-lg border-2 outline-none text-white border-orange-800 bg-gradient-to-b from-transparent to-tranfrom-transparent " +
        className
      }
      {...props}
    >
      <div class="absolute inset-0 opacity-0 -z-10 flex items-center justify-center rounded-md group-hover:opacity-100 transition duration-200 bg-gradient-to-b from-red-500 to-orange-500"></div>
      <div className="z-10">{props.children}</div>
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
