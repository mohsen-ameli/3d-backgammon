import { useContext, useEffect } from "react"
import { AuthContext } from "../../context/AuthContext"
import Button from "../../components/ui/Button"
import Container from "../../components/ui/Container"
import FormField from "../../components/ui/FormField"
import Header from "../../components/ui/Header"

const Login = () => {
  // Context
  const { login, errors, setErrors } = useContext(AuthContext)

  useEffect(() => {
    // Clear the errors when the component mounts
    setErrors(null)
  }, [setErrors])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Get the username and password
    const username = e.target.username.value
    const password = e.target.password.value

    if (username !== "" && password !== "")
      // Log the user in
      login(username, password)
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

        <Button type="submit" className="mt-3">
          Login
        </Button>
      </form>
    </Container>
  )
}

export default Login
