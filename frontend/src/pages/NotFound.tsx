import { Link } from "react-router-dom"
import Button from "../components/ui/Button"
import Container from "../components/ui/Container"
import Header from "../components/ui/Header"

const NotFound = () => {
  return (
    <Container className="relative">
      <Header to="/" title="404 not found" />
      <div className="absolute inset-0 top-1/2 h-fit w-full -translate-y-1/2 text-center">
        <h1 className="mb-4 text-2xl font-semibold">You seem a bit lost!</h1>
        <Link to="/">
          <Button>Take me back to safety!</Button>
        </Link>
      </div>
    </Container>
  )
}

export default NotFound
