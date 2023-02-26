import Container from "../../components/ui/Container"
import Header from "../../components/ui/Header"

/**
 * Playing with a random user.
 */
const PlayRandom = () => {
  return (
    <Container>
      <Header to="/" title="Random game" />
      <div className="">Finding a game for you ...</div>
    </Container>
  )
}

export default PlayRandom
