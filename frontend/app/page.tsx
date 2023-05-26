import Button3d from "@/components/ui/3d-button/Button3d"
import HyperLink from "@/components/ui/HyperLink"
import Logout from "@/components/ui/Logout"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"

export default async function Page() {
  const session = await getServerSession(authOptions)

  return (
    <>
      <div className="fixed bottom-[-35%] z-20 h-[65%] w-full rounded-t-[50%] bg-[#ffffffac]" />
      <div className="absolute flex h-full w-full items-end justify-around overflow-y-hidden">
        {session ? (
          <>
            <Logout />
            <Link href="/profile" className="z-20 mb-[35%] sm:mb-[20%] lg:mb-[10%]">
              <Button3d text="Profile" />
            </Link>
            <Link href="/friends" className="z-20 mb-[35%] sm:mb-[20%] lg:mb-[10%]">
              <Button3d text="Friends" />
            </Link>
          </>
        ) : (
          <>
            <Link href="/signin" className="z-20 mb-[13%] lg:mb-[2%] xl:mb-[4%]">
              <Button3d text="Sign In" />
            </Link>
            <Link href="/signup" className="z-20 mb-[30%] sm:mb-[22%] lg:mb-[5%] xl:mb-[10%]">
              <Button3d text="Sign Up" />
            </Link>
          </>
        )}
        <Link
          href="/game/pass-and-play"
          className={`z-20 ${session ? "mb-[10%] lg:mb-[4%]" : "mb-[13%] lg:mb-[2%] xl:mb-[4%]"}`}
        >
          <Button3d text="Single Player" />
        </Link>
      </div>

      <div className="relative flex items-center justify-around">
        {/* {session ? (
            <>
              <Logout />
              <Link href="/profile">
                <Button3d text="Profile" className="absolute bottom-14" />
              </Link>
              <Link href="/friends">
                <Button3d text="Friends" className="absolute bottom-14" />
              </Link>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button3d text="Sign In" className="absolute bottom-[10%]" />
              </Link>
              <Link href="/signup">
                <Button3d text="Sign Up" className="absolute bottom-12 sm:bottom-10 lg:bottom-20" />
              </Link>
            </>
          )}
          <Link href="/game/pass-and-play">
            <Button3d text="Single Player" />
          </Link> */}
      </div>

      {/* Footer */}
      <div className="absolute bottom-5 flex w-full items-center justify-center gap-x-2 text-sm text-black lg:text-lg">
        <Link href="/credits" className="text-orange-900 underline duration-150 ease-in-out hover:text-black">
          Credits
        </Link>
        •
        <HyperLink href="https://www.mohsenameli.com/" text="About Me" />
      </div>
    </>
  )
}
