import { useState } from "react"
import Modal from "../../../components/ui/Modal"
import LayoutBtn from "../components/LayoutBtn"
import Info from "../info/Info"
import Settings from "../settings/Settings"
import { faGear, faInfo, faLock, faLockOpen, faRotateLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useGameStore } from "@/game/store/useGameStore"

/**
 * Set of buttons on the top left corner
 */
export default function TopLeftLayout() {
  const inGame = useGameStore(state => state.inGame)

  const [controlsLock, setControlsLock] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)

  function switchControls() {
    useGameStore.getState().toggleControls?.("layout")
    setControlsLock(curr => !curr)
  }

  function openSettings() {
    setSettingsOpen(curr => !curr)
  }

  function openInfo() {
    setInfoOpen(curr => !curr)
  }

  function handleReset() {
    useGameStore.getState().resetOrbit?.("board")
  }

  return (
    <>
      <div className="absolute left-8 top-0 z-[17] grid grid-cols-2 gap-1 p-1 lg:left-0 lg:grid-cols-4 lg:gap-2 lg:p-2">
        {inGame && (
          <>
            <LayoutBtn title="Lock Controls" onClick={switchControls}>
              <FontAwesomeIcon icon={controlsLock ? faLockOpen : faLock} />
            </LayoutBtn>

            <LayoutBtn title="Reset Controls" onClick={handleReset}>
              <FontAwesomeIcon icon={faRotateLeft} />
            </LayoutBtn>
          </>
        )}

        <LayoutBtn title="Settings" onClick={openSettings}>
          <FontAwesomeIcon icon={faGear} />
        </LayoutBtn>

        <LayoutBtn title="Info" onClick={openInfo}>
          <FontAwesomeIcon icon={faInfo} />
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
