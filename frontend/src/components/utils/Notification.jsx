import { toast } from "react-toastify"

const Msg = ({ closeToast, toastProps, msg, accept, reject }) => (
  <div className="flex flex-col gap-y-2">
    {msg}
    <div className="flex justify-end gap-x-2">
      <button
        onClick={() => {
          reject()
          closeToast()
        }}
        className="px-2 py-1 border-2 rounded-lg text-black hover:text-white border-red-500 hover:bg-red-500 hover:ease-in-out duration-100"
      >
        Reject
      </button>
      <button
        onClick={() => {
          accept()
          closeToast()
        }}
        className="px-2 py-1 border-2 rounded-lg text-black hover:text-white border-green-500 hover:bg-green-500 hover:ease-in-out duration-100"
      >
        Accept
      </button>
    </div>
  </div>
)

const notification = (msg, type = "default", props) => {
  const args = {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  }

  if (type === "default") {
    toast(msg, args)
  } else if (type === "error") {
    toast.error(msg, args)
  } else if (type === "match") {
    toast.info(<Msg msg={msg} accept={props.accept} reject={props.reject} />, {
      ...args,
      autoClose: 10000,
      onClose: () => props.removeRequest(),
    })
  }
}

export default notification
