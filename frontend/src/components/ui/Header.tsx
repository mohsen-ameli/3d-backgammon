import Back from "./Back"

type HeaderProps = {
  className?: string
  href: string
  title: string
  children?: React.ReactNode
}

/**
 * Header that is used within all of the pages
 * @returns A nice div with a back button
 */
export default function Header({ className, href, title, children }: HeaderProps) {
  return (
    <div className="relative mb-5 w-full">
      <Back href={href} />
      <h1 className="text-center text-xl font-semibold">{title}</h1>
      <div className={`mx-auto max-w-[240px] ${className}`}>{children}</div>
    </div>
  )
}
