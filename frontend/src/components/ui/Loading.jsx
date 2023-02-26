import { ThreeDots } from "react-loader-spinner"
import Center from "./Center"
import Container from "./Container"

/**
 * Loading screen for some pages
 * @param {boolean} basice -> if true, then the loader will not be centered
 * @returns
 */
const Loading = ({ basic }) => {
  if (basic)
    return (
      <div className="mx-auto">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#2563eb"
          ariaLabel="three-dots-loading"
          visible={true}
        />
      </div>
    )
  return (
    <Container>
      <Center>
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#2563eb"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClassName=""
          visible={true}
        />
      </Center>
    </Container>
  )
}

export default Loading
