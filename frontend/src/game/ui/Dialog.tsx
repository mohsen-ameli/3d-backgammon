import { Children } from "../../components/types/children.type"

type CarouselProps = Children & {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Dialog = ({ setOpen, children }: CarouselProps) => {
  return (
    <>
      <div
        className="absolute top-0 left-0 z-[20] h-screen w-screen bg-[#0000005a]"
        onClick={() => setOpen(false)}
      />
      <div className="fixed left-1/2 top-1/2 z-[20] -translate-x-1/2 -translate-y-1/2 text-white">
        <div className="custom-scroll-bar max-h-screen min-w-[300px] max-w-[600px] rounded-md border-2 border-orange-700 bg-orange-900 p-8">
          {children}
        </div>

        <button
          className="absolute top-2 right-5 text-2xl duration-100 hover:text-slate-400 hover:ease-in-out"
          onClick={() => setOpen(false)}
        >
          x
        </button>
      </div>
    </>
  )
}

export default Dialog
