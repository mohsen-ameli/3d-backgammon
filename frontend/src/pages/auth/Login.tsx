import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import Button, { ButtonLoading } from "../../components/ui/Button"
import Container from "../../components/ui/Container"
import FormField from "../../components/ui/FormField"
import Header from "../../components/ui/Header"
// import jwt_decode from "jwt-decode"
import { Link } from "react-router-dom"

const Login = () => {
  const { login, errors, setErrors } = useContext(AuthContext)

  // const googleButton = useRef()
  const [clicked, setClicked] = useState(false)

  // Clearing the errors when the component mounts
  useEffect(() => {
    setErrors(null)
  }, [setErrors])

  // Clearing the clicked state when the errors change
  useEffect(() => {
    setClicked(false)
  }, [errors])

  // const handleGoogleCallback = (res) => {
  //   const token = jwt_decode(res.credential)
  //   token.email
  //   token.name
  //   token.picture
  // }

  // useEffect(() => {
  //   /* global google */
  //   google.accounts.id.initialize({
  //     client_id: import.meta.env.VITE_CLIENT_ID,
  //     callback: handleGoogleCallback,
  //     context: "signin",
  //   })

  //   google.accounts.id.renderButton(googleButton.current, {
  //     theme: "outline",
  //     size: "large",
  //     width: 369,
  //     type: "standard",
  //     text: "signin_with",
  //   })
  // }, [])

  // Handling user submission
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    const target = e.target as typeof e.target & {
      username: { value: string }
      password: { value: string }
    }

    // Getting the username and password
    const username = target.username.value
    const password = target.password.value

    if (username !== "" && password !== "") {
      // Log the user in
      login(username, password)
      setClicked(true)
    }
  }

  return (
    <Container>
      <Header to="/" title="Log In" />

      <form
        onSubmit={handleSubmit}
        className="flex h-full w-full flex-col justify-around"
        autoComplete="on"
      >
        <FormField label="Username" name="username" placeholder="Username" />
        <FormField
          label="Password"
          name="password"
          type="password"
          placeholder="Password"
          errors={errors}
        />

        <Button
          type="submit"
          className={
            "my-3 w-full self-center " + (clicked && "cursor-not-allowed")
          }
        >
          {clicked ? <ButtonLoading /> : "Log In"}
        </Button>

        <div className="grid grid-cols-3 text-center text-sm">
          <Link
            to=""
            className="text-gray-600 duration-200 hover:text-white hover:ease-in-out"
          >
            Reset password
          </Link>
          <div className="relative mx-1 flex items-center text-orange-800">
            <div className="flex-grow border-t border-t-orange-800"></div>
            <h1 className="mx-3 flex-shrink">OR</h1>
            <div className="flex-grow border-t border-t-orange-800"></div>
          </div>
          {/* <h1 className="border-r-2 ">OR</h1> */}
          <Link
            to="/signup"
            className="text-gray-600 duration-200 hover:text-white hover:ease-in-out"
          >
            Sign Up
          </Link>
        </div>
      </form>

      {/* <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t"></div>
        <h1 className="flex-shrink mx-4">OR</h1>
        <div className="flex-grow border-t"></div>
      </div>

      <div ref={googleButton}></div> */}
    </Container>
  )
}

export default Login
