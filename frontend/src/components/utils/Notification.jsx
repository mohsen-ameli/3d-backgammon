import { cssTransition, toast } from "react-toastify"
import "animate.css/animate.min.css"
import "react-toastify/dist/ReactToastify.css"

const notification = (msg, type = "default", props) => {
  const args = {
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
          props.reject()
        }
      }

      toast.info(
        <Msg msg={msg} accept={props.accept} reject={props.reject} />,
        {
          ...args,
          autoClose: 10000,
          closeButton: false,
          pauseOnHover: false,
          onClose: () => onClose(),
        }
      )

      break
    }
    case "deleteRejected":
      toast.info(msg, {
        ...args,
        autoClose: 3000,
        pauseOnHover: false,
        hideProgressBar: true,
        onClose: () => props.deleteRejected(),
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

const Msg = ({ closeToast, toastProps, msg, accept, reject }) => (
  <div className="flex flex-col gap-y-2 text-black">
    {msg}
    <div className="flex justify-end gap-x-2">
      <button
        onClick={() => {
          closeToast()
          reject()
        }}
        className="px-2 py-1 border-2 rounded-lg hover:text-white border-red-500 hover:bg-red-500 hover:ease-in-out duration-100"
      >
        Reject
      </button>
      <button
        onClick={() => {
          closeToast(true)
          accept()
        }}
        className="px-2 py-1 border-2 rounded-lg hover:text-white border-green-500 hover:bg-green-500 hover:ease-in-out duration-100"
      >
        Accept
      </button>
    </div>
  </div>
)

export default notification
