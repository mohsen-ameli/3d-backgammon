import Button, { ButtonLoading } from "@/components/ui/Button"
import notification from "@/components/utils/Notification"
import { BaseUser } from "@/types/User.type"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"

type AddButtonType = {
  sendFriendRequest: (id: number) => Promise<{
    message: string
    error: boolean
  }>
  friend: BaseUser
}

export default function AddButton({ sendFriendRequest, friend }: AddButtonType) {
  const [clicked, setClicked] = useState(false)
  const [error, setError] = useState<string | undefined | null>(undefined)

  async function handleClick() {
    setError(undefined)
    setClicked(true)
    const data = await sendFriendRequest(friend.id)

    if (data.error) {
      notification(data.message, "error")
      setError(data.message)
    } else {
      setError(null)
    }
  }

  if (clicked) {
    if (error === null) {
      return <FontAwesomeIcon icon={faCheck} className="mr-4 text-2xl text-emerald-500" />
    } else if (error === undefined) {
      return (
        <Button className="w-20" disabled>
          <ButtonLoading />
        </Button>
      )
    } else {
      return <></>
    }
  } else {
    return (
      <Button onClick={handleClick} className="w-20">
        Add
      </Button>
    )
  }
}