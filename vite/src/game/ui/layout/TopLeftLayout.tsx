import { useContext, useState } from "react"
import Modal from "../../../components/ui/Modal"
import { GameContext } from "../../context/GameContext"
import LayoutBtn from "../components/LayoutBtn"
import Info from "../info/Info"
import Settings from "../settings/Settings"

/**
 * Set of buttons on the top left corner
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
      <div className="absolute left-8 top-0 z-[17] grid grid-cols-2 gap-1 p-1 lg:left-0 lg:grid-cols-4 lg:gap-2 lg:p-2">
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

export default TopLeftLayout
