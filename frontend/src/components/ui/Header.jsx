import { useNavigate } from "react-router-dom"

const Header = (props) => {
  return (
    <>
      {/* Header section */}
      <div className="relative mb-6">
        <Back to={props.to} />
        <h1 className="text-xl font-semibold text-center">{props.title}</h1>
        {props.children}
      </div>
    </>
  )
}

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
