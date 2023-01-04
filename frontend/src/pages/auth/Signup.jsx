import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import Button from "../../components/ui/Button"
import Container from "../../components/ui/Container"
import Back from "../../components/ui/Back"
import Title from "../../components/ui/Title"
import FormField from "../../components/ui/FormField"

const Signup = () => {
  // Context
  const { signup, errors } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Get the username and password
    const username = e.target.username.value
    const email = e.target.email.value
    const password = e.target.password.value
    const password2 = e.target.password2.value

    if (username !== "" && email !== "" && password !== "" && password2 !== "")
      // sing the user up
      signup(username, email, password, password2)
  }

  return (
    <Container className="h-fit">
      {/* Header section */}
      <div className="relative">
        <Back to="/" />
        <Title>Sign up</Title>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-4"
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

        <Button type="submit" className="mt-2">
          Sign up
        </Button>
      </form>
    </Container>
  )
}

export default Signup
