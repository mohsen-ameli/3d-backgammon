import { Html } from "@react-three/drei"
import { PlayersType, UserCheckerType } from "../types/Game.type"

type SideProps = {
  ws?: WebSocket
  player: string
  color: UserCheckerType
  userChecker?: UserCheckerType
  players?: PlayersType
}

/**
 * Each player has a side, with their profile picture, name, their checker color,
 * and a timer for them to see how much time they have left to make a move.
 */
const Side = ({ ws, player, color, userChecker, players }: SideProps) => {
  // const [timer, setTimer] = useState(60) // 60 seconds

  // // If user has been offline for too long then we will be ending the game
  // const autoResign = () => {
  //   if (userChecker.current === players.me.color) {
  //     // I've been offline for too long
  //     ws.send(JSON.stringify({ finished: true, winner: players.enemy.id }))
  //   } else {
  //     // Enemy has been offline for too long
  //     ws.send(JSON.stringify({ finished: true, winner: players.me.id }))
  //   }
  // }

  // useEffect(() => {
  //   let newT = timer

  //   const timeout = () => {
  //     setTimer((t) => {
  //       newT = t
  //       if (t > 0) {
  //         return t - 1
  //       }
  //     })
  //     if (newT > -10) {
  //       setTimeout(timeout, 1000)
  //     } else {
  //       // Auto resign
  //       autoResign()
  //     }
  //   }

  //   if (userChecker.current === color) {
  //     timeout()
  //   }
  // }, [])

  return (
    <Html
      as="div"
      transform
      scale={0.2}
      position={[0, 0.25, player.includes("You") ? 1.2 : -1.2]}
      sprite
    >
      <div
        className={
          "flex h-full w-full select-none items-center justify-center gap-x-2 rounded-full px-4 py-2           outline outline-[3px] outline-offset-0 outline-sky-500 " +
          (color === "white"
            ? "bg-slate-200 text-black"
            : "bg-slate-600 text-white")
        }
      >
        {/* <img src="" alt="pfp" /> */}
        <i className="fa-solid fa-user"></i>
        <h1 className="text-lg">
          {player} playing as {color}
        </h1>
        {/* <h1
          className={
            timer > 20
              ? "text-sky-500"
              : timer > 10
              ? "text-orange-500"
              : "text-red-500"
          }
        >
          {timer}
        </h1> */}
      </div>
    </Html>
  )
}

export default Side
