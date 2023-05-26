import Button from "../../../components/ui/Button"
import Center from "../../../components/ui/Center"
import { DEFAULT_CHECKER_POSITIONS } from "../../data/Data"
import { useRouter } from "next/navigation"
import { faMinus, faTrophy, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Image from "next/image"
import { useGameStore } from "@/game/store/useGameStore"
import { useSession } from "next-auth/react"
import AxiosInstance from "@/components/utils/AxiosInstance"
import notification from "@/components/utils/Notification"

/**
 * An overlay when someone wins a live game.
 */
export default function WinnerLayout() {
  const { gameMode, phase } = useGameStore(state => ({
    gameMode: state.gameMode,
    phase: state.phase,
  }))

  const router = useRouter()
  const { data: session } = useSession()

  // Function to request a rematch
  async function playAgain() {
    if (gameMode === "pass-and-play") {
      useGameStore.setState({
        inGame: true,
        phase: "initial",
        userChecker: "white",
        gameMode: "pass-and-play",
        dice: { dice1: 0, dice2: 0, moves: 0 },
        checkers: JSON.parse(JSON.stringify(DEFAULT_CHECKER_POSITIONS)),
      })

      useGameStore.getState().resetOrbit?.("board", true)
    } else {
      const axiosInstance = AxiosInstance(session!)
      const players = useGameStore.getState().players

      const res = await axiosInstance.put("/api/game/handle-match-request/", {
        action: "send",
        friend_id: players?.enemy.id,
      })
      if (!res.data.success) notification("Your friend is not online!", "error")
      // Showing a rejection notification after 10 seconds
      setTimeout(() => {
        const msg = `${players?.enemy.name} rejected your match request.`
        notification(msg, "delete-rejected")
      }, 10000)
    }
  }

  // Redirects the user back home
  function goHome() {
    router.push("/")
    useGameStore.setState({ phase: undefined })
  }

  if (phase !== "ended") return <></>

  let TopSection: JSX.Element
  if (gameMode === "pass-and-play") {
    const left = (
      <>
        <FontAwesomeIcon icon={faUser} className="text-[30pt] text-black" />
        <h1>Black</h1>
      </>
    )

    const right = (
      <>
        <FontAwesomeIcon icon={faUser} className="text-[30pt] text-white" />
        <h1>White</h1>
      </>
    )

    const userChecker = useGameStore.getState().userChecker
    TopSection = <Top score={userChecker === "black" ? ["1", "0"] : ["0", "1"]} left={left} right={right} />
  } else {
    const players = useGameStore.getState().players
    const winner = useGameStore.getState().winner

    TopSection = (
      <Top
        score={winner?.id === players?.enemy.id ? ["1", "0"] : ["0", "1"]}
        left={getLeftRight("left")}
        right={getLeftRight("right")}
      />
    )
  }

  return (
    <Center className="z-[10]">
      <div className="h-full w-full rounded-lg bg-[#cbd5e18f] p-6">
        {TopSection}
        <div className="flex w-full flex-col gap-y-2 text-sm lg:text-base">
          <Button onClick={playAgain}>Rematch</Button>
          <Button onClick={goHome}>Main menu</Button>
        </div>
      </div>
    </Center>
  )
}

function getLeftRight(side: "left" | "right") {
  const players = useGameStore.getState().players

  if (!players) return <></>

  return (
    <>
      <div className="relative h-[50px] w-[50px] lg:h-[80px] lg:w-[80px] xl:h-[100px] xl:w-[100px]">
        <Image
          src={side === "left" ? players.enemy.image : players.me.image}
          alt="Profile Pic"
          fill
          className="inline-block rounded-full"
        />
      </div>
      <h1>{side === "left" ? players.enemy.name : players.me.name}</h1>
    </>
  )
}

function Top({ score, left, right }: { score: [string, string]; left: JSX.Element; right: JSX.Element }) {
  return (
    <div className="flex items-center justify-between gap-x-4 p-4">
      {/* Black */}
      <div className="flex flex-col items-center gap-y-2">
        {score[0] === "1" && <FontAwesomeIcon icon={faTrophy} className="absolute top-3 text-[#ffbb00]" />}
        {left}
      </div>

      {/* Vs */}
      <div className="flex flex-col items-center text-xl">
        <h1>vs</h1>
        <h1>
          {score[0]} <FontAwesomeIcon icon={faMinus} /> {score[1]}
        </h1>
      </div>

      {/* White */}
      <div className="flex flex-col items-center gap-y-2">
        {score[1] === "1" && <FontAwesomeIcon icon={faTrophy} className="absolute top-3 text-[#ffbb00]" />}
        {right}
      </div>
    </div>
  )
}
