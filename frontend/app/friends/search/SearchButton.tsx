"use client"

import Button, { ButtonLoading } from "@/components/ui/Button"
import React, { useState } from "react"

export default function SearchButton() {
  const [clicked, setClicked] = useState(false)

  function handleClick() {
    setClicked(true)
    setTimeout(() => {
      setClicked(false)
    }, 1000)
  }

  return (
    <Button disabled={clicked} onClick={handleClick} className="w-[80px]">
      {clicked ? <ButtonLoading /> : "Search"}
    </Button>
  )
}
