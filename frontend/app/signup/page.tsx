import Button from "@/components/ui/Button"
import Header from "@/components/ui/Header"
import ProviderIcon from "@/components/ui/ProviderButton"
import Link from "next/link"

export default function Signup() {
  return (
    <>
      <Header href="/" title="Register" />

      <div className="flex h-full w-full flex-col gap-4">
        <Link href="/signup/continue">
          <Button className="mt-3 w-full self-center">Continue with Email</Button>
        </Link>

        <div className="relative mx-1 flex items-center text-black">
          <div className="grow border-t border-t-black"></div>
          <h1 className="mx-3 shrink">OR</h1>
          <div className="grow border-t border-t-black"></div>
        </div>

        <div className="flex flex-col gap-4 pb-4">
          <ProviderIcon name="discord" />
          <ProviderIcon name="google" />
          <ProviderIcon name="facebook" />
        </div>
      </div>
    </>
  )
}
