import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import Button, { ButtonLoading } from "../../components/ui/Button"
import Container from "../../components/ui/Container"
import FormField from "../../components/ui/FormField"
import Header from "../../components/ui/Header"

const Signup = () => {
  const [clicked, setClicked] = useState(false)
  // Context
  const { signup, errors, setErrors } = useContext(AuthContext)

  useEffect(() => {
    // Clear the errors when the component mounts
    setErrors(null)
  }, [setErrors])

  // Clear the clicked state when the errors change
  useEffect(() => {
    setClicked(false)
  }, [errors])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Get the username and password
    const username = e.target.username.value
    const email = e.target.email.value
    const password = e.target.password.value
    const password2 = e.target.password2.value

    // prettier-ignore
    if (username !== "" && email !== "" && password !== "" && password2 !== "") {
      // sing the user up
      signup(username, email, password, password2)
      setClicked(true)
    }
  }

  return (
    <Container>
      <Header to="/" title="Register" />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-6"
        autoComplete="on"
      >
        <FormField
          label="Username"
          name="username"
          placeholder="Username"
          errors={errors}
        />
        <FormField
          label="Email"
          name="email"
          placeholder="Email"
          errors={errors}
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          placeholder="Password"
          errors={errors}
        />
        <FormField
          label="Password (again)"
          name="password2"
          type="password"
          placeholder="Password Confirmation"
          errors={errors}
        />

        <Button
          type="submit"
          className={
            "mt-4 w-32 self-center " + (clicked && "cursor-not-allowed")
          }
        >
          {clicked ? <ButtonLoading /> : "Sign Up"}
        </Button>
      </form>
    </Container>
  )
}

export default Signup
