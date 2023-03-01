import { cssTransition, toast, ToastOptions } from "react-toastify"
import "animate.css/animate.min.css"
import "react-toastify/dist/ReactToastify.css"
import Msg from "./Msg"

/**
 * Used to send beautiful notifications, throughout the app.
 */
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
  accept?: () => void
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
      toast.info(<Msg msg={msg} accept={accept!} reject={reject!} />, {
        ...args,
        autoClose: 10000,
        closeButton: false,
        pauseOnHover: false,
      })
      toast.onChange((payload) => {
        if (payload.status === "removed") {
          reject?.()
        }
      })

      break
    }
    case "deleteRejected":
      toast.info(msg, {
        ...args,
        autoClose: 3000,
        pauseOnHover: false,
        hideProgressBar: true,
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

export default notification
