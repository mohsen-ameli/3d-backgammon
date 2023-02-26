import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

const Status = () => {
  const location = useLocation()
  const [status, setStatus] = useState("")

  const getStatus = () => {
    if (location.state.status) {
      setStatus("Online")
      return
    }

    const date = new Date(location.state.lastLogin * 1000)
    const today = new Date()
    let lastSeen = ""

    // Seen within a few years
    if (date.getFullYear() < today.getFullYear()) {
      lastSeen = "a long time ago"
    }
    // Seen within this year
    else if (date.getMonth() < today.getMonth()) {
      lastSeen = "a while ago"
    }
    // Seen within this month
    else if (date.getDate() < today.getDate()) {
      const ago = today.getDate() - date.getDate()
      lastSeen = ago + " days ago"
    }
    // Seen today
    else if (date.getHours() < today.getHours()) {
      const f = new Intl.DateTimeFormat("default", {
        hour: "numeric",
        hour12: true,
        minute: "numeric",
      })
      lastSeen = "today around " + f.format(date)
    }
    // Seen within the last hour
    else {
      const ago = today.getMinutes() - date.getMinutes()
      lastSeen = ago + " minutes ago"
    }

    setStatus("Last seen " + lastSeen)
  }

  useEffect(() => {
    location && getStatus()
  }, [location])

  return <p className="text-center text-xs text-slate-500">{status}</p>
}

export default Status
