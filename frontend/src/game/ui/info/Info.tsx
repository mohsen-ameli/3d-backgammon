import { faU } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Image from "next/image"

/**
 * Information about the game and how to interact with the website
 */
export default function Info() {
  return (
    <div className="flex flex-col gap-y-5">
      <div className="">
        <h1 className="mb-2 text-center text-xl font-bold">How to interact:</h1>
        <div className="flex size-full items-center justify-evenly text-sm text-white lg:text-lg">
          <div className="flex flex-col items-center gap-y-2">
            <Image width="0" height="0" className="size-[50px]" src="/svg/finger-zoom.svg" alt="finger-zoom" />
            <h1>Zoom</h1>
            <Image width="0" height="0" className="size-[50px]" src="/svg/mouse-zoom.svg" alt="mouse-zoom" />
          </div>
          <div className="flex flex-col items-center gap-y-2">
            <Image width="0" height="0" className="size-[50px]" src="/svg/finger-drag.svg" alt="finger-drag" />
            <h1>Rotate</h1>
            <Image width="0" height="0" className="size-[50px]" src="/svg/mouse-left.svg" alt="mouse-left" />
          </div>
          <div className="flex flex-col items-center gap-y-2">
            <Image width="0" height="0" className="size-[50px]" src="/svg/finger-pan.svg" alt="finger-pan" />
            <h1>Pan</h1>
            <Image width="0" height="0" className="size-[50px]" src="/svg/mouse-right.svg" alt="mouse-right" />
          </div>
        </div>
      </div>

      <div className="">
        <h1 className="mb-2 text-center text-xl font-bold">How to play the game:</h1>
        <ul className="ml-8 list-disc leading-7">
          <li>
            Check to see what checker color you are playing as. You can see this on the top left corner of your profile
            picture.
          </li>
          <li>If it&apos;s your turn, throw the dice, and if not, wait your turn.</li>
          <li>
            You want to move all of your checkers to you home. If you are playing as white, you home will be the 6
            bottom right columns, and if you&apos;re playing as black the top right 6, is your home.
          </li>
          <li>
            You want to move generally like a <FontAwesomeIcon icon={faU} className="rotate-90" /> shape.
          </li>
          <li>
            The objective of the game is to move all of your checkers to your home, and then bear them off. The first
            player who bears all of their checkers off, will be the winner!
          </li>
        </ul>
      </div>
    </div>
  )
}
