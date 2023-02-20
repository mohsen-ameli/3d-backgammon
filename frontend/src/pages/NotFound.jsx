import { Link } from "react-router-dom"
import Button from "../components/ui/Button"
import Container from "../components/ui/Container"
import Header from "../components/ui/Header"

const NotFound = () => {
  return (
    <Container className="relative">
      <Header to="/" title="404 not found" />
      <div className="absolute inset-0 text-center top-1/2 -translate-y-1/2 w-full h-fit">
        <h1 className="text-2xl font-semibold mb-4">You seem a bit lost!</h1>
        <Link to="/">
          <Button>Take me back to safety!</Button>
        </Link>
      </div>
    </Container>
  )
}

export default NotFound
