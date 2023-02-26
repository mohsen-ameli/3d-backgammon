import { cssTransition, toast, ToastOptions } from "react-toastify"
import "animate.css/animate.min.css"
import "react-toastify/dist/ReactToastify.css"

const notification = (
  msg: string,
  type:
    | "info"
    | "error"
    | "match"
    | "deleteRejected"
    | "messsage"
    | "default" = "default",
  reject?: () => void,
  accept?: () => void,
  deleteRejected?: () => void
) => {
  const args: ToastOptions<{}> = {
    position: "top-center",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  }

  switch (type) {
    case "info":
      toast.info(msg, args)
      break
    case "error":
      toast.error(msg, args)
      break
    case "match": {
      const onClose = (skip = false) => {
        if (!skip) {
          reject?.()
        }
      }

      toast.info(<Msg msg={msg} accept={accept} reject={reject} />, {
        ...args,
        autoClose: 10000,
        closeButton: false,
        pauseOnHover: false,
        onClose: () => onClose(),
      })

      break
    }
    case "deleteRejected":
      toast.info(msg, {
        ...args,
        autoClose: 3000,
        pauseOnHover: false,
        hideProgressBar: true,
        onClose: () => deleteRejected?.(),
      })
      break
    case "messsage": {
      const transition = cssTransition({
        enter: "animate__animated animate__tada",
        exit: "animate__animated animate__lightSpeedOutLeft",
      })

      toast.dark(msg, {
        position: "bottom-left",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
        className: "w-fit",
        transition,
      })

      break
    }
    default:
      toast(msg, args)
      break
  }
}

type MsgProps = {
  closeToast?: (close: boolean) => void
  msg: string
  accept?: () => void
  reject?: () => void
}

const Msg = ({ closeToast, msg, accept, reject }: MsgProps) => (
  <div className="flex flex-col gap-y-2 text-black">
    {msg}
    <div className="flex justify-end gap-x-2">
      <button
        onClick={() => {
          closeToast?.(false)
          reject?.()
        }}
        className="rounded-lg border-2 border-red-500 px-2 py-1 duration-100 hover:bg-red-500 hover:text-white hover:ease-in-out"
      >
        Reject
      </button>
      <button
        onClick={() => {
          closeToast?.(true)
          accept?.()
        }}
        className="rounded-lg border-2 border-green-500 px-2 py-1 duration-100 hover:bg-green-500 hover:text-white hover:ease-in-out"
      >
        Accept
      </button>
    </div>
  </div>
)

export default notification
