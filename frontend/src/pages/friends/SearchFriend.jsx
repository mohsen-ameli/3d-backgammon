import Container from "../../components/ui/Container"
import Input from "../../components/ui/Input"
import Title from "../../components/ui/Title"
import Back from "../../components/ui/Back"

const SearchFriend = () => {
  const search = (e) => {
    const value = e.target.value

    if (value !== "") {
      // fetch
      console.log(value)
    }
  }

  return (
    <Container>
      {/* Header section */}
      <div className="relative">
        <Back to="/friends" />
        <Title>Search for new friend</Title>
      </div>

      <Input type="text" placeholder="Name or ID or Email" onChange={search} />
    </Container>
  )
}

export default SearchFriend
