"use client"

import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"

type RequestProps = {
  action: (id: number, action: "accept" | "reject") => Promise<void>
  id: number
}

export function AcceptButton({ action, id }: RequestProps) {
  return (
    <FontAwesomeIcon
      icon={faCheck}
      className="cursor-pointer p-1 text-2xl text-green-500 hover:text-green-700"
      onClick={() => action(id, "accept")}
    />
  )
}

export function RejectButton({ action, id }: RequestProps) {
  return (
    <FontAwesomeIcon
      icon={faXmark}
      className="cursor-pointer p-1 text-2xl text-red-500 hover:text-red-700"
      onClick={() => action(id, "reject")}
    />
  )
}
