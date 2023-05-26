import { faDiceFive, faDiceFour, faDiceOne, faDiceSix, faDiceThree, faDiceTwo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useGameStore } from "@/game/store/useGameStore"
import { useEffect, useState } from "react"
import { shallow } from "zustand/shallow"

/**
 * Small function used in the SidePanels to get the dice icons.
 */
export default function DiceMoves() {
  const [jsx, setJsx] = useState<JSX.Element[]>([])

  useEffect(() => {
    makeJsx()

    const unsub = useGameStore.subscribe(
      state => state.dice,
      (dice, prev) => {
        if (dice.moves !== prev.moves) makeJsx()
      },
      { equalityFn: shallow },
    )

    return () => unsub()
  }, [])

  function makeJsx() {
    const dice = useGameStore.getState().dice
    const arr = []

    if (dice.moves > 2) {
      for (let i = 0; i < dice.moves; i++) {
        arr.push(getMoves(dice.dice1))
      }
    } else if (dice.moves === 2) {
      arr.push(getMoves(dice.dice1))
      arr.push(getMoves(dice.dice2))
    } else if (dice.dice1 !== 0) {
      arr.push(getMoves(dice.dice1))
    } else {
      arr.push(getMoves(dice.dice2))
    }

    setJsx(arr)
  }

  return (
    <div
      className={`mx-auto grid h-full ${
        jsx.length > 2 ? "w-[50px] grid-cols-2 lg:w-full lg:grid-cols-4" : "w-[50px] grid-cols-2 lg:w-[50%]"
      } gap-2 text-[18pt] lg:text-[22pt]`}
    >
      {jsx.map((number, index) => (
        <span key={index} className="flex justify-center">
          {number}
        </span>
      ))}
    </div>
  )
}

function getMoves(num: number) {
  if (num === 1) {
    return <FontAwesomeIcon icon={faDiceOne} />
  } else if (num === 2) {
    return <FontAwesomeIcon icon={faDiceTwo} />
  } else if (num === 3) {
    return <FontAwesomeIcon icon={faDiceThree} />
  } else if (num === 4) {
    return <FontAwesomeIcon icon={faDiceFour} />
  } else if (num === 5) {
    return <FontAwesomeIcon icon={faDiceFive} />
  } else if (num === 6) {
    return <FontAwesomeIcon icon={faDiceSix} />
  } else {
    return <></>
  }
}
