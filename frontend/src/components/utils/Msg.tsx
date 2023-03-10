type MsgProps = {
  msg: string
  green: string
  red: string
  closeToast?: (close: boolean) => void
  accept: () => void
  reject?: () => void
}

/**
 * Message toast used in the notification component
 */
const Msg = ({ msg, green, red, closeToast, accept, reject }: MsgProps) => (
  <div className="flex flex-col gap-y-2 text-black">
    {msg}
    <div className="flex justify-end gap-x-2">
      <button
        onClick={() => {
          closeToast?.(false)
          reject && reject()
        }}
        className="rounded-lg border-2 border-red-500 px-2 py-1 duration-100 hover:bg-red-500 hover:text-white hover:ease-in-out"
      >
        {red}
      </button>
      <button
        onClick={() => {
          closeToast?.(true)
          accept()
        }}
        className="rounded-lg border-2 border-green-500 px-2 py-1 duration-100 hover:bg-green-500 hover:text-white hover:ease-in-out"
      >
        {green}
      </button>
    </div>
  </div>
)

export default Msg
