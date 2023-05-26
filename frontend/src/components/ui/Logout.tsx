"use client"

import React from "react"
import Button3d from "@/components/ui/3d-button/Button3d"
import { signOut } from "next-auth/react"

export default function SignOut() {
  return (
    <div className="z-20 mb-[10%] lg:mb-[4%]">
      <Button3d text="Sign Out" onClick={() => signOut()} />
    </div>
  )
}
