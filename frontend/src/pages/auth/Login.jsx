import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import Button from "../../components/ui/Button"
import Container from "../../components/ui/Container"
import Input from "../../components/ui/Input"
import FormField from "../../components/ui/FormField"

const Login = () => {
  // Context
  const { login } = useContext(AuthContext)

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
    <Container>
      {/* <PageTitle text="Login" /> */}

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-y-8"
        autoComplete="on"
      >
        <FormField label="Username" name="username" placeholder="Username" />
        <FormField
          label="Password"
          name="password"
          type="password"
          placeholder="Password"
        />

        <Button type="submit">Login</Button>
      </form>
    </Container>
  )
}

export default Login
