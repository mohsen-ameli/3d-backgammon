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
    y: "-100vh",
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
}

const Modal = ({ setOpen, open, className, children }: CarouselProps) => {
  const c = twMerge(
    `fixed left-1/2 top-1/2 z-[100] flex h-screen w-screen -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-[#0000005a] text-white ${className}`,
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
          className={c}
        >
          <motion.div variants={modalVariants} onClick={e => e.stopPropagation()}>
            <div className="custom-scroll-bar max-h-screen min-w-[400px] overflow-x-hidden rounded-xl border-2 border-orange-700 bg-[#7c2d12cc] p-8 lg:max-w-[600px]">
              {children}
            </div>

            <FontAwesomeIcon
              icon={faX}
              size="lg"
              width={20}
              className="absolute right-4 top-4 duration-100 hover:cursor-pointer hover:text-slate-400 hover:ease-in-out"
              onClick={() => setOpen(false)}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal
