import { useNavigate } from "react-router-dom"
import Button from "./Button"

type HeaderProps = {
  className?: string
  to: string
  title: string
  children?: React.ReactNode
}

/**
 * Header that is used within all of the pages
 * @returns A nice dive with a back button
 */
const Header = ({ className, to, title, children }: HeaderProps) => {
  return (
    <div className="relative mb-5 w-full">
      <Back to={to} />
      <h1 className="text-center text-xl font-semibold">{title}</h1>
      <div className={`mx-auto max-w-[240px] ${className}`}>{children}</div>
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
    <div className="absolute -left-1 -top-1">
      <Button className="h-[35px] px-[8px]" onClick={goBackTo}>
        <i className="fa-solid fa-arrow-left-long"></i> Back
      </Button>
    </div>
  )
}

export default Header
