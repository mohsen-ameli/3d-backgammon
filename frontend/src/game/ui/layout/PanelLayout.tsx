import SidePanel from "../components/SidePanel"
import { useSession } from "next-auth/react"
import { useGameStore } from "@/game/store/useGameStore"

export default function PanelLayout() {
  const inGame = useGameStore(state => state.inGame)
  const players = useGameStore(state => state.players)

  const { data: session } = useSession()

  if (!inGame) return <></>

  const gameMode = useGameStore.getState().gameMode

  const myImg = gameMode === "pass-and-play" ? "" : session?.user.image
  const enemyImg = gameMode === "pass-and-play" ? "" : players?.enemy.image

  return (
    <>
      <SidePanel img={myImg} player={players?.me} sideType="me" />
      <SidePanel img={enemyImg} player={players?.enemy} sideType="enemy" />
    </>
  )
}
