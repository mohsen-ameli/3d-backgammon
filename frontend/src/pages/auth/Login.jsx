import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import Button from "../../components/ui/Button"
import Container from "../../components/ui/Container"
import FormField from "../../components/ui/FormField"
import Title from "../../components/ui/Title"
import Back from "../../components/ui/Back"

const Login = () => {
  // Context
  const { login, errors } = useContext(AuthContext)

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
      {/* Header section */}
      <div className="relative">
        <Back to="/" />
        <Title>Log In</Title>
      </div>

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
        />

        {errors && <p className="text-red-500">{errors}</p>}

        <Button type="submit">Login</Button>
      </form>
    </Container>
  )
}

export default Login
