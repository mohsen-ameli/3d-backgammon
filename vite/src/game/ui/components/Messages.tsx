import { AnimatePresence, motion } from "framer-motion"
import { useContext, useEffect, useRef, useState } from "react"
import { GameContext } from "../../context/GameContext"
import { MESSAGE_COOLDOWN } from "../../data/Data"
import { MessagesType, PlayerType } from "../../types/Game.type"

type MessagesProps = {
  player: PlayerType | undefined
}

/**
 * The in-game message bubble.
 */
const Messages = ({ player }: MessagesProps) => {
  const { messages, players } = useContext(GameContext)

  const [msgs, setMsgs] = useState<MessagesType>(messages)

  const timeout = useRef<NodeJS.Timeout>()

  // Handling in-game messages
  useEffect(() => {
    if (!messages) return

    // Playing the message audio
    const audioUrl = messages.message.audio
    if (audioUrl !== undefined) {
      const msgAudio = new Audio(audioUrl)
      msgAudio.play()
    }

    setMsgs(messages)
    clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setMsgs(null), MESSAGE_COOLDOWN)
  }, [messages])

  return (
    <AnimatePresence mode="wait">
      {msgs && msgs.userId === player?.id && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`absolute top-1/4 flex w-[120px] -translate-y-1/2 lg:top-1/3 lg:w-[200px] lg:-translate-y-1/3 ${
            msgs.userId === players?.me.id
              ? // My message
                "left-0 -ml-32 justify-end lg:-ml-52"
              : // Enemy's message
                "right-0 -mr-32 justify-start lg:-mr-52"
          }`}
        >
          <div
            className={`w-fit bg-[#cec7e9] p-2 text-lg lg:text-xl ${
              msgs.userId === players?.me.id
                ? // My message
                  "rounded-t-xl rounded-bl-xl"
                : // Enemy's message
                  "rounded-t-xl rounded-br-xl"
            }`}
          >
            {msgs.message.message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Messages
