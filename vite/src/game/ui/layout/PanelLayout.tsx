import { useContext, useEffect, useState } from "react"
import useFetch from "../../../components/hooks/useFetch"
import { ProfileData } from "../../../components/types/Profile.type"
import { GameContext } from "../../context/GameContext"
import SidePanel from "../components/SidePanel"

const PanelLayout = () => {
  const { gameMode, players, inGame } = useContext(GameContext)

  if (!inGame) return <></>

  // Getting user image
  const { data }: ProfileData = useFetch("/api/get-user-profile/")
  const [img, setImg] = useState("")
  useEffect(() => setImg(data?.image), [data])

  // prettier-ignore
  if (gameMode.current === "pass-and-play") {
    return (
      <>
        <SidePanel img="" player={players?.me} sideType="me" />
        <SidePanel img="" player={players?.enemy} sideType="enemy" />
      </>
    )
  } else {
    return (
      <>
        <SidePanel img={img} player={players?.me} sideType="me" />
        <SidePanel img={players?.enemy.image} player={players?.enemy} sideType="enemy" />
      </>
    )
  }
}

export default PanelLayout
