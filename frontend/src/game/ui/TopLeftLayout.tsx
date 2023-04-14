import { useContext, useState } from "react"
import { GameContext } from "../context/GameContext"
import LayoutBtn from "./LayoutBtn"
import Modal from "./Modal"
import Settings from "./settings/Settings"

/**
 * Set of button on the top left corner
 */
const TopLeftLayout = () => {
  const { resetOrbit, toggleControls, inGame } = useContext(GameContext)

  const [controlsLock, setControlsLock] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)

  const switchControls = () => {
    toggleControls.current("layout")
    setControlsLock(curr => !curr)
  }

  const openSettings = () => setSettingsOpen(curr => !curr)
  const openInfo = () => setInfoOpen(curr => !curr)

  return (
    <>
      <div className="absolute top-0 left-8 z-[17] grid grid-cols-2 gap-1 p-1 lg:left-0 lg:grid-cols-4 lg:gap-2 lg:p-2">
        {inGame && (
          <>
            <LayoutBtn title="Lock Controls" onClick={switchControls}>
              <i
                className={
                  controlsLock ? "fa-solid fa-lock-open" : "fa-solid fa-lock"
                }
              />
            </LayoutBtn>

            <LayoutBtn
              title="Reset Controls"
              onClick={() => resetOrbit.current("board")}
            >
              <i className="fa-solid fa-rotate-left" />
            </LayoutBtn>
          </>
        )}

        <LayoutBtn title="Settings" onClick={openSettings}>
          <i className="fa-solid fa-gear" />
        </LayoutBtn>

        <LayoutBtn title="Info" onClick={openInfo}>
          <i className="fa-solid fa-info" />
        </LayoutBtn>
      </div>

      <Modal setOpen={setSettingsOpen} open={settingsOpen}>
        <Settings setOpen={setSettingsOpen} />
      </Modal>

      <Modal setOpen={setInfoOpen} open={infoOpen}>
        <Info />
      </Modal>
    </>
  )
}

const Info = () => {
  return (
    <>
      <h1 className="mb-2 text-xl font-bold">How to play the game:</h1>
      <ul className="ml-8 list-disc leading-7">
        <li>
          Check to see what checker color you are playing as. You can see this
          on the top left corner of your profile picture.
        </li>
        <li>If it's your turn, throw the dice, and if not, wait your turn.</li>
        <li>
          You want to move all of your checkers to you home. If you are playing
          as white, you home will be the 6 bottom right columns, and if you're
          playing as black the top right 6, is your home.
        </li>
        <li>
          You want to move generally like a{" "}
          <i className="fa-solid fa-u rotate-90"></i> shape.
        </li>
        <li>
          The objective of the game is to move all of your checkers to your
          home, and then bear them off. The first player who bears all of their
          checkers off, will be the winner!
        </li>
      </ul>
    </>
  )
}

export default TopLeftLayout
