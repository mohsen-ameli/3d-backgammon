import { useContext, useEffect, useRef, useState } from "react"
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

  useEffect(() => {
    // Clear the errors when the component mounts
    setErrors(null)
  }, [setErrors])

  // Clear the clicked state when the errors change
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Get the username and password
    const username = e.target.username.value
    const password = e.target.password.value

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
        className="flex flex-col gap-y-3 w-full h-full"
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
            "mt-4 mb-2 self-center " + (clicked && "cursor-not-allowed")
          }
        >
          {clicked ? <ButtonLoading /> : "Log In"}
        </Button>

        <div className="text-sm text-center">
          New around here?{" "}
          <Link
            to="/signup"
            className="text-gray-600 hover:text-white hover:ease-in-out duration-200"
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
