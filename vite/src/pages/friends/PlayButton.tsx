import gsap from "gsap"
import { useEffect, useRef, useState } from "react"
import { FriendType } from "./Friend.type"

type PlayButtonProps = {
  friend: FriendType
  play: (friend: FriendType) => void
}

const PlayButton = ({ friend, play }: PlayButtonProps) => {
  const [clicked, setClicked] = useState(false)
  const ref = useRef<HTMLElement>(null!)

  useEffect(() => {
    if (clicked) {
      gsap.to(ref.current, {
        rotationZ: 360,
        duration: 1.25,
        ease: "linear",
        repeat: -1,
        yoyo: true,
      })

      setTimeout(() => {
        setClicked(false)
      }, 5000)
    }
  }, [clicked])

  const handleClick = () => {
    if (friend.is_online) {
      play(friend)
      setClicked(true)
    }
  }

  if (clicked)
    return (
      <i
        ref={ref}
        className="fa-regular fa-hourglass-half self-center justify-self-center"
      />
    )

  return (
    <button
      className={
        "fa-solid fa-dice self-center justify-self-center " +
        (friend.is_online
          ? "text-indigo-600 hover:text-indigo-900"
          : "cursor-default")
      }
      onClick={handleClick}
    />
  )
}

export default PlayButton
