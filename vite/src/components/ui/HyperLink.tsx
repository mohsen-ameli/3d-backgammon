import { ButtonHTMLAttributes } from "react"

type HyperLinkProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  to: string
  text: string
}

const HyperLink = ({ to, text, ...props }: HyperLinkProps) => {
  const openNewTab = () => {
    const newWindow = window.open(to, "_blank", "noopener,noreferrer")
    if (newWindow) newWindow.opener = null
  }

  return (
    <button
      {...props}
      className={`text-orange-900 underline duration-150 ease-in-out hover:text-black ${props.className}`}
      onClick={openNewTab}
    >
      {text}
    </button>
  )
}

export default HyperLink
