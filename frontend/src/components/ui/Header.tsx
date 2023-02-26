import { useNavigate } from "react-router-dom"

type HeaderProps = {
  className?: string
  to: string
  title: string
  children?: React.ReactNode
}

/**
 * Header that is used within all of the pages
 * @param {*} className -> Extra classNames
 * @param {*} props -> Any other props to be attached to the header
 * @returns A nice dive with a back button
 */
const Header = ({ className, to, title, children }: HeaderProps) => {
  return (
    <div className="relative mb-5 w-full">
      {/* Header section */}
      <Back to={to} />
      <div className={`mx-auto max-w-[240px] ${className}`}>
        <h1 className="text-center text-xl font-semibold">{title}</h1>
        {children}
      </div>
    </div>
  )
}

type BackProps = { to: string }

// Back button
const Back = ({ to }: BackProps) => {
  const navigate = useNavigate()

  const goBackTo = () => {
    navigate(to)
  }

  return (
    <button
      className="absolute left-0 h-full text-black duration-75 hover:text-slate-600 hover:ease-in-out"
      onClick={goBackTo}
    >
      <i className="fa-solid fa-arrow-left-long"></i> Back
    </button>
  )
}

export default Header
