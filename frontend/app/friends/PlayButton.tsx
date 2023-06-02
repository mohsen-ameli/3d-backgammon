import { FriendType } from "@/types/Friend.type"
import { faDice, faHourglassHalf } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { gsap } from "gsap"
import { useEffect, useRef, useState } from "react"

type PlayButtonProps = {
  friend: FriendType
  play: (friend: FriendType) => void
}

export default function PlayButton({ friend, play }: PlayButtonProps) {
  const [clicked, setClicked] = useState(false)
  const ref = useRef<SVGSVGElement>(null!)

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

  function handleClick() {
    if (friend.is_online) {
      play(friend)
      setClicked(true)
    }
  }

  if (clicked) return <FontAwesomeIcon icon={faHourglassHalf} className="self-center justify-self-center" ref={ref} />

  return (
    <button
      className={
        "self-center justify-self-center text-xl " +
        (friend.is_online ? "text-indigo-600 hover:text-indigo-900" : "cursor-default")
      }
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={faDice} />
    </button>
  )
}
