import { ThreeDots } from "react-loader-spinner"
import Center from "./Center"
import Container from "./Container"

const Loader = (
  <ThreeDots height="80" width="80" radius="9" color="#2563eb" ariaLabel="three-dots-loading" visible={true} />
)

/**
 * Loading screen for some pages
 * @param {boolean} basic if true, then the loader will not be centered
 */
export default function Loading({ basic = false, center = false }: { basic?: boolean; center?: boolean }) {
  if (basic) {
    if (center) {
      return <Center>{Loader}</Center>
    }
    return <div className="mx-auto">{Loader}</div>
  }

  return (
    <Container>
      <Center>{Loader}</Center>
    </Container>
  )
}
