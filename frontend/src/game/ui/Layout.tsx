import { ButtonHTMLAttributes, useContext, useState } from "react"
import { Link } from "react-router-dom"
import { RChildren } from "../../components/children.type"
import Button from "../../components/ui/Button"
import { GameWrapperContext } from "../context/GameWrapperContext"
import DiceMoves from "./DiceMoves"

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & RChildren

const Layout = () => {
  const { inGame } = useContext(GameWrapperContext)

  if (!inGame) return <></>

  return (
    <>
      <LayoutLeft />
      <LayoutRight />
      <LayoutMain />
    </>
  )
}

const LayoutMain = () => {
  const { throwDice, showThrow } = useContext(GameWrapperContext)

  return (
    <div className="absolute right-0 bottom-0 z-[10] m-2 h-fit w-[100px] rounded-md bg-orange-900 px-2 py-4 lg:top-1/2 lg:w-[180px] lg:-translate-y-1/2">
      <div className="relative flex flex-col items-center justify-center gap-y-12 lg:gap-y-24">
        {/* Enemy side */}
        <div className="flex flex-col items-center">
          <img
            src="/person1.jpg"
            alt="enemy"
            className="h-[50px] w-[50px] rounded-full object-cover object-center lg:h-[80px] lg:w-[80px] xl:h-[100px] xl:w-[100px]"
          />
          <div className="relative mt-2 flex flex-col items-center justify-center pb-8 text-xs text-black lg:text-lg">
            <h1>MoeNew</h1>
            <div className="absolute bottom-0">
              <DiceMoves dice={{ dice1: 2, dice2: 5, moves: 2 }} />
            </div>
          </div>
        </div>

        {/* Throw button */}
        <div className="absolute w-full text-xs text-white lg:text-lg">
          {showThrow ? (
            <Button
              title="Throw Dice"
              className="h-7 w-full px-0 lg:h-10 lg:w-full lg:px-4"
              onClick={() => throwDice.current()}
            >
              Throw <i className="fa-solid fa-dice"></i>
            </Button>
          ) : (
            showThrow === false && (
              <Button className="w-full cursor-default break-all">
                Loading dice...
              </Button>
            )
          )}
        </div>

        {/* My side pfp */}
        <div className="flex flex-col items-center">
          <img
            src="/person2.jpg"
            alt="me"
            className="h-[50px] w-[50px] rounded-full object-cover object-center lg:h-[80px] lg:w-[80px] xl:h-[100px] xl:w-[100px]"
          />

          {/* My side info */}
          <div className="relative mt-2 flex flex-col items-center justify-center pb-8 text-xs text-white lg:text-lg">
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

const LayoutRight = () => {
  const { resign, gameMode } = useContext(GameWrapperContext)

  return (
    <div className="absolute top-0 right-0 z-[10] flex items-center justify-center gap-x-1 p-1 md:gap-x-2 md:p-2">
      <Btn title="Chat">
        <i className="fa-regular fa-comments"></i>
      </Btn>
      {gameMode.current === "pass-and-play" ? (
        <Link to="/">
          <Btn title="Exit">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </Btn>
        </Link>
      ) : (
        <Btn title="Resign" onClick={() => resign.current()}>
          <i className="fa-regular fa-flag -rotate-[20deg]"></i>
        </Btn>
      )}
    </div>
  )
}

const LayoutLeft = () => {
  const { resetOrbit, toggleControls } = useContext(GameWrapperContext)

  const [open, setOpen] = useState(true)

  const switchControls = () => {
    toggleControls.current(true)
    setOpen(curr => !curr)
  }

  const openSettings = () => {}

  return (
    <div className="absolute top-0 left-0 z-[10] flex items-center justify-center gap-x-1 p-1 md:gap-x-2 md:p-2">
      <Btn title="Lock Controls" onClick={switchControls}>
        <i className={open ? "fa-solid fa-lock-open" : "fa-solid fa-lock"}></i>
      </Btn>
      <Btn title="Reset Controls" onClick={() => resetOrbit.current()}>
        <i className="fa-solid fa-rotate-left"></i>
      </Btn>
      <Btn title="Settings" onClick={openSettings}>
        <i className="fa-solid fa-gear"></i>
      </Btn>
    </div>
  )
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

export default Layout
