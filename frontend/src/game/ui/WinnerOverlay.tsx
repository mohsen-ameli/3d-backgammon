import { Html } from "@react-three/drei"
import Button from "../../components/ui/Button"

type WinnerOverlayProps = {
  winner: string
  gameMode: string
  playAgain: () => void
  goHome: () => void
}

const WinnerOverlay = ({
  winner,
  gameMode,
  playAgain,
  goHome,
}: WinnerOverlayProps) => {
  return (
    <Html as="div" transform scale={0.2} center sprite>
      <div className="h-full w-full rounded-lg bg-[#cbd5e18f] p-8">
        <h1 className="mb-4 text-center text-4xl">{winner} wins!</h1>
        <div className="flex w-full flex-col gap-y-2">
          {gameMode === "pass-and-play" && (
            <Button onClick={playAgain}>Play again</Button>
          )}
          <Button onClick={goHome}>Main menu</Button>
        </div>
      </div>
    </Html>
  )
}

export default WinnerOverlay
