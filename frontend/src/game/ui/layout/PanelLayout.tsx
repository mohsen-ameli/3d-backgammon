import SidePanel from "../components/SidePanel"
import { useSession } from "next-auth/react"
import { useGameStore } from "@/game/store/useGameStore"

export default function PanelLayout() {
  const inGame = useGameStore(state => state.inGame)
  const players = useGameStore(state => state.players)

  const { data: session } = useSession()

  if (!inGame) return <></>

  const gameMode = useGameStore.getState().gameMode

  if (gameMode === "pass-and-play") {
    return (
      <>
        <SidePanel img="" player={players?.me} sideType="me" />
        <SidePanel img="" player={players?.enemy} sideType="enemy" />
      </>
    )
  } else {
    return (
      <>
        <SidePanel img={session?.user.image} player={players?.me} sideType="me" />
        <SidePanel img={players?.enemy.image} player={players?.enemy} sideType="enemy" />
      </>
    )
  }
}
