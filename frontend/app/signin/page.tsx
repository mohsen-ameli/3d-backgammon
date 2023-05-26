import DiscordButton from "./DiscordButton"
import SigninForm from "./SigninForm"

export default async function SigninPage() {
  return (
    <div className="flex h-full w-full flex-col">
      <SigninForm />

      {/* <div className="relative mx-1 mb-2 flex items-center text-black">
        <div className="grow border-t border-t-black"></div>
        <h1 className="mx-3 shrink">OR</h1>
        <div className="grow border-t border-t-black"></div>
      </div> */}

      {/* <DiscordButton /> */}
    </div>
  )
}
