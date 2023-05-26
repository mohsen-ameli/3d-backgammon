import { FriendType } from "@/types/Friend.type"

export default function getStatus(friend: FriendType) {
  if (friend.is_online) {
    return "Online"
  }

  const date = new Date(friend.last_login * 1000)
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
    if (ago < 1) lastSeen = "just now"
    else lastSeen = ago + " minutes ago"
  }

  return "Last seen " + lastSeen
}
