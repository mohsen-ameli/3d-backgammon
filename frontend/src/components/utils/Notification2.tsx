import React from "react"
import { toast, ToastOptions } from "react-toastify"

type MsgProps = {
  msg: string
  accept: () => null
  reject: () => null
}

const notification = (
  msg: string,
  type: "info" | "error" | "match" | "deleteRejected",
  reject: () => null,
  accept: () => null,
  deleteRejected: () => null
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
    case "deleteRejected":
      toast.info(msg, {
        ...args,
        autoClose: 3000,
        pauseOnHover: false,
        hideProgressBar: true,
        onClose: () => deleteRejected?.(),
      })
      break
    case "match":
      {
        const onClose = (skip = false) => !skip && reject?.()

        toast.info(
          <Msg msg={msg} accept={() => accept?.()} reject={() => reject?.()} />,
          {
            ...args,
            autoClose: 10000,
            closeButton: false,
            pauseOnHover: false,
            onClose: () => onClose(),
          }
        )
      }
      break
    default:
      toast(msg, args)
      break
  }
}

const Msg = ({ msg, accept, reject }: MsgProps) => (
  <div className="flex flex-col gap-y-2 text-black">
    {msg}
    <div className="flex justify-end gap-x-2">
      <button
        onClick={() => {
          // closeToast(false)
          reject()
        }}
        className="px-2 py-1 border-2 rounded-lg hover:text-white border-red-500 hover:bg-red-500 hover:ease-in-out duration-100"
      >
        Reject
      </button>
      <button
        onClick={() => {
          // closeToast(true)
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
