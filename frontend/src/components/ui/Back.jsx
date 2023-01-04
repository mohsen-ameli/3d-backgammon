import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

const Back = ({ className, to }) => {
  const navigate = useNavigate()
  const { setErrors } = useContext(AuthContext)

  const goBackTo = () => {
    navigate(to)
    setErrors(null)
  }

  return (
    <button
      className={`h-full absolute left-0 text-black hover:text-slate-600 hover:ease-in-out duration-75 ${className}`}
      onClick={goBackTo}
    >
      <i className="fa-solid fa-arrow-left-long"></i> Back
    </button>
  )
}

export default Back
