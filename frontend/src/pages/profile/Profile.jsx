import Container from "../../components/ui/Container"
import Header from "../../components/ui/Header"
import useFetch from "../../components/hooks/useFetch"

const Profile = () => {
  const { data, loading, error } = useFetch("api/get-user-profile/")

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error</div>

  const getGamesWon = () => {
    if (data.games_won === 0) return 0
    return Math.round((data.games_won / data.total_games) * 100)
  }

  const getGamesLost = () => {
    if (data.games_lost === 0) return 0
    return Math.round((data.games_lost / data.total_games) * 100)
  }

  const getDateJoined = () => {
    const date = new Date(data.date_joined * 1000)
    return new Intl.DateTimeFormat("default", {
      dateStyle: "long",
    }).format(date)
  }

  return (
    <Container>
      <Header to="/" title="Profile" />

      <p className="text-lg mb-6">A member since {getDateJoined()}</p>

      <div className="flex flex-col items-center gap-y-4 text-lg">
        <h1 className="w-full text-center border-b-2 border-blue-400">
          Games stats
        </h1>
        {data.total_games > 0 ? (
          <>
            <p>Games won: {getGamesWon()}%</p>
            <p>Games lost: {getGamesLost()}%</p>
            <p>Total Games: {data.total_games}</p>
          </>
        ) : (
          <p>No games played yet</p>
        )}
      </div>
    </Container>
  )
}

export default Profile
