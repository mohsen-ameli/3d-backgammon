import { DiceMoveType } from "../types/Dice.type"

type DiceMovesProps = {
  dice: DiceMoveType
}

/**
 * Small function used in UI to get the dice icons.
 */
const DiceMoves = ({ dice }: DiceMovesProps) => {
  const jsx = []

  if (dice.moves > 2) {
    for (let i = 0; i < dice.moves; i++) {
      jsx.push(getMoves(dice.dice1))
    }
  } else if (dice.moves === 2) {
    jsx.push(getMoves(dice.dice1))
    jsx.push(getMoves(dice.dice2))
  } else if (dice.dice1 !== 0) {
    jsx.push(getMoves(dice.dice1))
  } else {
    jsx.push(getMoves(dice.dice2))
  }

  return (
    <div className="flex h-full w-full flex-wrap items-center justify-center gap-2 text-[18pt] lg:flex-grow lg:text-[22pt] ">
      {jsx.map((number, index) => (
        <span key={index} className="flex">
          {number}
        </span>
      ))}
    </div>
  )
}

const getMoves = (num: number) => {
  if (num === 1) {
    return <i className="fa-solid fa-dice-one"></i>
  } else if (num === 2) {
    return <i className="fa-solid fa-dice-two"></i>
  } else if (num === 3) {
    return <i className="fa-solid fa-dice-three"></i>
  } else if (num === 4) {
    return <i className="fa-solid fa-dice-four"></i>
  } else if (num === 5) {
    return <i className="fa-solid fa-dice-five"></i>
  } else if (num === 6) {
    return <i className="fa-solid fa-dice-six"></i>
  }
}

export default DiceMoves
