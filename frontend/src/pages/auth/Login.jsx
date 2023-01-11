import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import Button, { ButtonLoading } from "../../components/ui/Button"
import Container from "../../components/ui/Container"
import FormField from "../../components/ui/FormField"
import Header from "../../components/ui/Header"

const Login = () => {
  const [clicked, setClicked] = useState(false)
  // Context
  const { login, errors, setErrors } = useContext(AuthContext)

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
    const password = e.target.password.value

    if (username !== "" && password !== "") {
      // Log the user in
      login(username, password)
      setClicked(true)
    }
  }

  return (
    <Container className="h-fit">
      <Header to="/" title="Log In" />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-4"
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
          className={(clicked && "cursor-not-allowed ") + "mt-3"}
        >
          {clicked ? <ButtonLoading /> : "Log In"}
        </Button>
      </form>
    </Container>
  )
}

export default Login
