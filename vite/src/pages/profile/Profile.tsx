import { useEffect, useState } from "react"
import useFetch from "../../components/hooks/useFetch"
import { ProfileData } from "../../components/types/Profile.type"
import Container from "../../components/ui/Container"
import Header from "../../components/ui/Header"
import Loading from "../../components/ui/Loading"

/**
 * User's profile
 */
const Profile = () => {
  const { data, loading, error }: ProfileData = useFetch(
    "/api/get-user-profile/"
  )

  const [img, setImg] = useState<string>()

  useEffect(() => {
    if (data) setImg(data.image)
  }, [data])

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

  let Content
  if (loading) {
    Content = <Loading basic />
  } else if (error) {
    Content = (
      <div>Error happened when getting your information! Check back later!</div>
    )
  } else {
    Content = (
      <>
        <div className="flex flex-col items-center justify-center gap-y-2">
          <img
            src={img}
            alt="Profile Pic"
            className="h-[80px] w-[80px] rounded-full object-cover object-center xl:h-[100px] xl:w-[100px]"
          />
          <h1 className="text-lg">{data.username}</h1>
          <p className="text-center text-lg">
            A member since {getDateJoined()}
          </p>
        </div>

        <div className="my-4 w-full border-b-2 border-blue-400"></div>

        <div className="flex flex-col items-center gap-y-2 text-lg">
          {data.total_games > 0 ? (
            <>
              <p>
                Games won: {data.games_won} / {data.total_games} or{" "}
                {getGamesWon()}%
              </p>
              <p>
                Games lost: {data.games_lost} / {data.total_games} or{" "}
                {getGamesLost()}%
              </p>
              <p>Total Games: {data.total_games}</p>
            </>
          ) : (
            <p>No games played yet</p>
          )}
        </div>
      </>
    )
  }

  return (
    <Container>
      <Header to="/" title="Profile" />
      {Content}
    </Container>
  )
}

export default Profile
