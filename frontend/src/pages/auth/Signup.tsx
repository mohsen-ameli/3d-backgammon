import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import Button, { ButtonLoading } from "../../components/ui/Button"
import Container from "../../components/ui/Container"
import FormField from "../../components/ui/FormField"
import Header from "../../components/ui/Header"
import { Link } from "react-router-dom"
import ImageUploader from "../../components/ui/ImageUploader"
import { ImageType } from "../../components/types/Image.type"

const Signup = () => {
  const { signup, errors, setErrors } = useContext(AuthContext)
  const [btnClicked, setBtnClicked] = useState(false)

  const [image, setImage] = useState<ImageType>(null)

  // Clearing the errors when the component mounts
  useEffect(() => {
    setErrors(null)
  }, [setErrors])

  // Clearing the clicked state when the errors change
  useEffect(() => {
    setBtnClicked(false)
  }, [errors])

  // Handling user submition
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    const target = e.target as typeof e.target & {
      username: { value: string }
      email: { value: string }
      password: { value: string }
      password2: { value: string }
    }

    // Get the username and password
    const username = target.username.value
    const email = target.email.value
    const password = target.password.value
    const password2 = target.password2.value

    // prettier-ignore
    if (username !== "" && email !== "" && password !== "" && password2 !== "") {
      // Register the user
      signup(username, email, password, password2, image)
      setBtnClicked(true)
    }
  }

  return (
    <Container>
      <Header to="/" title="Register" />

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

        <div className="">
          <label htmlFor="image-input">Profile Picture (optional)</label>
          <ImageUploader image={image} setImage={setImage} />
        </div>

        <Button
          type="submit"
          className={
            "mt-3 w-full self-center " + (btnClicked && "cursor-not-allowed")
          }
        >
          {btnClicked ? <ButtonLoading /> : "Sign Up"}
        </Button>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-gray-600 duration-200 hover:text-white hover:ease-in-out"
          >
            Log In
          </Link>
        </div>
      </form>
    </Container>
  )
}

export default Signup
