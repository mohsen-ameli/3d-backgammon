"use client"

import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Session } from "next-auth"
import React from "react"

type RequestProps = {
  session: Session
  id: number
  action: (session: Session, id: number, action: "accept" | "reject") => Promise<void>
  type: "accept" | "reject"
}

export const generateStaticParams = []

export function ActionButton(props: RequestProps) {
  const { session, action, id, type } = props
  async function handleClick() {
    await action(session, id, type)
  }

  const c = `cursor-pointer p-1 text-2xl ${
    type === "accept" ? "text-green-500 hover:text-green-700" : "text-red-500 hover:text-red-700"
  }`

  return <FontAwesomeIcon onClick={handleClick} icon={type === "accept" ? faCheck : faXmark} className={c} />
}
