type MessageBoxProps = {
  type: "friend" | "user"
  message: string
  date: string
}

export default function MessageBox({ type, message, date }: MessageBoxProps) {
  return (
    <div
      className={
        "relative mb-2 flex h-fit w-fit min-w-[150px] max-w-[300px] items-center justify-between gap-x-2 p-2 pb-6 " +
        (type === "friend"
          ? "mr-auto rounded-r-2xl rounded-t-2xl bg-slate-200"
          : "ml-auto mr-2 rounded-l-2xl rounded-t-2xl bg-[#f4ac9c]")
      }
    >
      <p className="break-all">{message}</p>
      <p className="absolute bottom-1 right-2 break-normal text-xs text-slate-500">{date}</p>
    </div>
  )
}
