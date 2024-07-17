"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import JoinNow from "./JoinNow"

export default function Premium() {
  return (
    <>
      <div className="grid h-full grid-cols-1 gap-2 text-black sm:grid-cols-2">
        <div className="flex h-full min-h-[300px] flex-col rounded-xl bg-slate-300 px-2 py-4">
          <h1 className="text-center text-lg font-semibold">Free</h1>
          <div className="my-2 border-b-2 border-orange-300" />
          <ul className="my-2">
            <li>
              <FontAwesomeIcon icon={faCheck} color="green" /> Access to the game
            </li>
            <li>
              <FontAwesomeIcon icon={faCheck} color="green" /> Access to 3 environment maps
            </li>
            <li>
              <FontAwesomeIcon icon={faCheck} color="green" /> Access to 1 dice and checkers skin
            </li>
          </ul>
        </div>
        <div className="relative flex h-full min-h-[300px] flex-col justify-between rounded-xl bg-slate-300 px-2 py-4">
          <div>
            <h1 className="text-center text-xl font-semibold">Premium (In progress)</h1>
            <div className="my-2 border-b-2 border-orange-300" />
            <ul className="my-2">
              <li>
                <FontAwesomeIcon icon={faCheck} color="green" /> Access to the game
              </li>
              <li>
                <FontAwesomeIcon icon={faCheck} color="green" /> Access to ALL environment maps
              </li>
              <li>
                <FontAwesomeIcon icon={faCheck} color="green" /> Access to ALL dice and checkers skin
              </li>
            </ul>
          </div>

          <JoinNow />
        </div>
      </div>
    </>
  )
}
