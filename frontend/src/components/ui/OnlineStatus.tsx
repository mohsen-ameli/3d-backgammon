"use client"

import { useEffect } from "react"
import notification from "../utils/Notification"

export default function OnlineStatus() {
  function onOffline() {
    notification("You are offline! 🙁", "default", true)
  }

  function onOnline() {
    notification("You are now online! 😊")
  }

  useEffect(() => {
    window.addEventListener("online", onOnline)
    window.addEventListener("offline", onOffline)

    return () => {
      window.removeEventListener("online", onOnline)
      window.removeEventListener("offline", onOffline)
    }
  }, [])

  return <></>
}
