"use client"

import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"

type RequestProps = {
  action: (id: string, action: "accept" | "reject") => Promise<void>
  id: string
}

export function AcceptButton(props: RequestProps) {
  const { action, id } = props
  return (
    <FontAwesomeIcon
      icon={faCheck}
      className="cursor-pointer p-1 text-2xl text-green-500 hover:text-green-700"
      onClick={() => action(id, "accept")}
    />
  )
}

export function RejectButton(props: RequestProps) {
  const { action, id } = props
  return (
    <FontAwesomeIcon
      icon={faXmark}
      className="cursor-pointer p-1 text-2xl text-red-500 hover:text-red-700"
      onClick={() => action(id, "reject")}
    />
  )
}
