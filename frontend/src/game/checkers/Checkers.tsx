import Checker from "./Checker"
import { useState } from "react"
import Modal from "@/components/ui/Modal"
import { Html } from "@react-three/drei"

/**
 * Container for all of the checkers
 */
export default function Checkers() {
  // Showing the invalid move panel
  const [show, setShow] = useState(false)
  const numbers = Array.from({ length: 30 }, (_, i) => i)

  return (
    <>
      <Html>
        <Modal setOpen={setShow} open={show} className="min-w-[300px]">
          You don&apos;t have a move!
        </Modal>
      </Html>

      {numbers.map(num => (
        <Checker id={num} setShow={setShow} key={num} />
      ))}
    </>
  )
}
