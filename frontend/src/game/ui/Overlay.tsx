import { ButtonHTMLAttributes, useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Button from "../../components/ui/Button"
import { GameWrapperContext } from "../context/GameWrapperContext"
import { GameModeType } from "../types/GameWrapper.type"
import DiceMoves from "./DiceMoves"

const Overlay = () => {
  const { gameMode } = useContext(GameWrapperContext)

  return (
    <>
      <OverlayLeft />
      <OverlayRight mode={gameMode.current} />
      <OverlayMain />
    </>
  )
}

const OverlayMain = () => {
  const ThrowDice = () => {}

  return (
    <div className="absolute left-0 top-1/2 z-[10] m-2 h-fit w-[150px] -translate-y-1/2 rounded-md bg-orange-900 px-2 py-4 lg:w-[200px] xl:w-[250px]">
      <div className="flex flex-col items-center justify-center gap-y-2 lg:gap-y-4">
        {/* Enemy side */}
        <div className="flex flex-col items-center">
          <img
            src="/person1.jpg"
            alt="enemy"
            className="h-[60px] w-[60px] rounded-full object-cover object-center lg:h-[80px] lg:w-[80px] xl:h-[100px] xl:w-[100px]"
          />
          <div className="relative mt-1 flex flex-col items-center justify-center pb-8 text-black md:text-lg">
            <h1>MoeNew</h1>
            <div className="absolute bottom-0">
              <DiceMoves dice={{ dice1: 2, dice2: 5, moves: 2 }} />
            </div>
          </div>
        </div>

        {/* Throw button */}
        <Button
          title="Throw Dice"
          className="w-full text-white"
          onClick={ThrowDice}
        >
          Throw <i className="fa-solid fa-dice"></i>
        </Button>

        {/* My side pfp */}
        <div className="flex flex-col items-center">
          <img
            src="/person2.jpg"
            alt="me"
            className="h-[60px] w-[60px] rounded-full object-cover object-center lg:h-[80px] lg:w-[80px] xl:h-[100px] xl:w-[100px]"
          />

          {/* My side info */}
          <div className="relative mt-1 flex flex-col items-center justify-center pb-8 text-white md:text-lg">
            <h1>NoobMoe</h1>
            <div className="absolute bottom-0">
              <DiceMoves dice={{ dice1: 2, dice2: 5, moves: 2 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

type RProps = {
  mode: GameModeType
}

const OverlayRight = ({ mode }: RProps) => {
  const navigate = useNavigate()

  return (
    <div className="absolute top-0 right-0 z-[10] flex items-center justify-center gap-x-1 p-1 md:gap-x-2 md:p-2">
      <Btn title="Chat">
        <i className="fa-regular fa-comments"></i>
      </Btn>
      {mode === "pass-and-play" ? (
        <Link to="/">
          <Btn title="Exit">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </Btn>
        </Link>
      ) : (
        <Btn title="Resign">
          <i className="fa-regular fa-flag -rotate-[20deg]"></i>
        </Btn>
      )}
    </div>
  )
}

const OverlayLeft = () => {
  const [open, setOpen] = useState(false)

  const toggleControls = () => {
    setOpen(curr => !curr)
  }

  return (
    <div className="absolute top-0 left-0 z-[10] flex items-center justify-center gap-x-1 p-1 md:gap-x-2 md:p-2">
      <Btn title="Lock Controls" onClick={toggleControls}>
        <i className={open ? "fa-solid fa-lock-open" : "fa-solid fa-lock"}></i>
      </Btn>
      <Btn title="Reset Controls">
        <i className="fa-solid fa-rotate-left"></i>
      </Btn>
      <Btn title="Settings">
        <i className="fa-solid fa-gear"></i>
      </Btn>
    </div>
  )
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
}

const Btn = ({ children, ...props }: BtnProps) => {
  return (
    <button
      className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-red-200 duration-200 ease-in-out hover:bg-red-300"
      {...props}
    >
      {children}
    </button>
  )
}

export default Overlay
