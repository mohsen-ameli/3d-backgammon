import Button from "@/components/ui/Button"
import DiscordButton from "@/signin/DiscordButton"
import Link from "next/link"

export default function Signup() {
  return (
    <div className="flex h-full w-full flex-col">
      <Link href="/signup/continue">
        <Button className="my-3 w-full self-center">Continue with Email</Button>
      </Link>

      {/* <div className="relative mx-1 mb-2 flex items-center text-black">
        <div className="grow border-t border-t-black"></div>
        <h1 className="mx-3 shrink">OR</h1>
        <div className="grow border-t border-t-black"></div>
      </div> */}

      <DiscordButton />
    </div>
  )
}
