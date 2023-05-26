import { Children } from "@/types/children.type"
import { AnimatePresence, Variants, motion } from "framer-motion"

type CarouselProps = Children & {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
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

const Modal = ({ setOpen, open, children }: CarouselProps) => {
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
          <motion.div variants={modalVariants} onClick={e => e.stopPropagation()}>
            <div className="custom-scroll-bar max-h-screen min-w-[400px] overflow-x-hidden rounded-md border-2 border-orange-700 bg-orange-900 p-8 lg:max-w-[600px]">
              {children}
            </div>

            <button
              className="absolute right-5 top-2 text-2xl duration-100 hover:text-slate-400 hover:ease-in-out"
              onClick={() => setOpen(false)}
            >
              x
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal
