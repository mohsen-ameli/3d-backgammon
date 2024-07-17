import { Children } from "@/types/children.type"
import { faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AnimatePresence, Variants, motion } from "framer-motion"
import { twMerge } from "tailwind-merge"

type CarouselProps = Children & {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  className?: string
}

const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
}

const modalVariants: Variants = {
  hidden: {
    y: "-1vh",
  },
  visible: {
    y: "0",
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 400,
      mass: 1.5,
    },
  },
  exit: {
    y: "1vh",
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 400,
      mass: 1.5,
    },
  }
}

const Modal = ({ setOpen, open, className, children }: CarouselProps) => {
  const c = twMerge(
    `custom-scroll-bar relative drop-shadow-xl text-black mx-auto max-h-screen overflow-x-hidden rounded-xl bg-[#cbd5e1c0] p-8 max-w-fit ${className}`,
  )

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          onClick={() => setOpen(false)}
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed left-1/2 top-1/2 z-[100] flex h-screen w-screen -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-[#0000005a] text-white"
        >
          <motion.div variants={modalVariants} onClick={e => e.stopPropagation()} className={c}>
            {children}
            <FontAwesomeIcon
              icon={faX}
              size="lg"
              className="absolute right-0 top-0 p-4 text-black duration-100 hover:cursor-pointer hover:text-slate-500 hover:ease-in-out"
              onClick={() => setOpen(false)}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal
