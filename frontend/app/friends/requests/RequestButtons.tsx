"use client"

import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Session } from "next-auth"
import React from "react"

type RequestProps = {
  session: Session
  id: number
  action: (session: Session, id: number, action: "accept" | "reject") => Promise<void>
  fetchStuff: () => Promise<void>
}

export function AcceptButton(props: RequestProps) {
  const { session, action, id, fetchStuff } = props
  async function handleClick() {
    await action(session, id, "accept")
    await fetchStuff()
  }

  return (
    <FontAwesomeIcon
      onClick={handleClick}
      icon={faCheck}
      className="cursor-pointer p-1 text-2xl text-green-500 hover:text-green-700"
    />
  )
}

export function RejectButton(props: RequestProps) {
  const { session, action, id, fetchStuff } = props
  async function handleClick() {
    await action(session, id, "reject")
    await fetchStuff()
  }

  return (
    <FontAwesomeIcon
      onClick={handleClick}
      icon={faXmark}
      className="cursor-pointer p-1 text-2xl text-red-500 hover:text-red-700"
    />
  )
}
