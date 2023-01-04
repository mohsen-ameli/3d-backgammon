import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import Button from "../../components/ui/Button"
import Container from "../../components/ui/Container"
import Input from "../../components/ui/Input"

const Signup = () => {
  // Context
  const { signup } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Get the username and password
    const username = e.target.username.value
    const email = e.target.email.value
    const password = e.target.password.value
    const password2 = e.target.password.value

    if (username !== "" && email !== "" && password !== "" && password2 !== "")
      // sing the user up
      signup(username, email, password, password2)
  }

  return (
    <Container>
      {/* <PageTitle text="Sign up" /> */}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-8"
        autoComplete="on"
      >
        <label htmlFor="username">
          Username
          <Input
            name="username"
            id="username"
            placeholder="Username"
            className="mt-3"
          />
        </label>
        <label htmlFor="email">
          Email
          <Input name="email" id="email" placeholder="Email" className="mt-3" />
        </label>
        <label htmlFor="password">
          Password
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            className="mt-3"
          />
        </label>
        <label htmlFor="password2">
          Password (again)
          <Input
            type="password"
            name="password2"
            id="password2"
            placeholder="Password Confirmation"
            className="mt-3"
          />
        </label>
        <Button type="submit">Sign up</Button>
      </form>
    </Container>
  )
}

export default Signup
