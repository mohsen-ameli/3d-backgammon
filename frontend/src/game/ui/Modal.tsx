import { AnimatePresence, Variants, motion } from "framer-motion"
import { Children } from "../../components/types/children.type"

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
          className="fixed top-1/2 left-1/2 z-[999] flex h-screen w-screen -translate-y-1/2 -translate-x-1/2 items-center justify-center bg-[#0000005a] text-white"
        >
          <motion.div
            variants={modalVariants}
            onClick={e => e.stopPropagation()}
          >
            <div className="custom-scroll-bar max-h-screen min-w-[300px] max-w-[400px] rounded-md border-2 border-orange-700 bg-orange-900 p-8 lg:max-w-[600px]">
              {children}
            </div>

            <button
              className="absolute top-2 right-5 text-2xl duration-100 hover:text-slate-400 hover:ease-in-out"
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
