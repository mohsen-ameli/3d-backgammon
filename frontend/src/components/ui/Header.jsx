import { useNavigate } from "react-router-dom"

/**
 * Header that is used within all of the pages
 * @param {*} className -> Extra classNames
 * @param {*} props -> Any other props to be attached to the header
 * @returns A nice dive with a back button
 */
const Header = ({ className, ...props }) => {
  return (
    <div className="relative mb-6 w-full">
      {/* Header section */}
      <Back to={props.to} />
      <div className={`max-w-[240px] mx-auto ${className}`}>
        <h1 className="text-xl font-semibold text-center">{props.title}</h1>
        {props.children}
      </div>
    </div>
  )
}

// Back button
const Back = ({ to }) => {
  const navigate = useNavigate()

  const goBackTo = () => {
    navigate(to)
  }

  return (
    <button
      className="h-full absolute left-0 text-black hover:text-slate-600 hover:ease-in-out duration-75"
      onClick={goBackTo}
    >
      <i className="fa-solid fa-arrow-left-long"></i> Back
    </button>
  )
}

export default Header
