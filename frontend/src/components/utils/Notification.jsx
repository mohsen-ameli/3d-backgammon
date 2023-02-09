import { toast } from "react-toastify"

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

  if (type === "default") {
    toast(msg, args)
  } else if (type === "info") {
    toast.info(msg, args)
  } else if (type === "error") {
    toast.error(msg, args)
  } else if (type === "match") {
    const onClose = (skip = false) => {
      if (!skip) {
        props.reject()
      }
    }

    toast.info(<Msg msg={msg} accept={props.accept} reject={props.reject} />, {
      ...args,
      autoClose: 10000,
      closeButton: false,
      pauseOnHover: false,
      onClose,
    })
  } else if (type === "deleteRejected") {
    toast.info(msg, {
      ...args,
      autoClose: 3000,
      pauseOnHover: false,
      hideProgressBar: true,
      onClose: () => props.deleteRejected(),
    })
  }
}

export default notification
