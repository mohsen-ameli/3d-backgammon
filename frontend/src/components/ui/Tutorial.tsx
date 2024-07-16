"use client"

import Modal from "@/components/ui/Modal"
import { useGameStore } from "@/game/store/useGameStore"
import { useStageStore } from "@/store/useStageStore"
import { faChessPawn, faChessQueen } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useRef, useState } from "react"

// *** Step 1: Pro vs Noob
// *** Step 2: Click on pass & play
// Wait
// Step 3: Click on Throw Dice
// Wait
// Step 4: Show what the dice numbers mean
// Step 5: Show who they're playing as
// Step 6: Show an animation of how they're supposed to move
// Step 7: Focus on a single checker, and show an animation of dragging it to the next spot
// ... Teach how to remove checkers
// ... Teach how to bear checkers off

function getTutorialStatus(): boolean {
  type storage = { finished: boolean }
  let finishedTutorial = false

  if (typeof window !== "undefined") {
    const s = localStorage.getItem("finishedTutorial")
    if (!s) {
      localStorage.setItem("finishedTutorial", JSON.stringify({ finished: false }))
    } else {
      const parsed: storage = JSON.parse(s)
      finishedTutorial = parsed.finished
    }
  }

  return finishedTutorial
}

export default function Tutorial() {
  const stage = useStageStore(state => state.stage)

  useEffect(() => {
    // getTutorialStatus()
  }, [])

  switch (stage) {
    case "pro-noob":
      return <ProNoob />
    case "single-player":
      return <FocusOn element="single-player" />
    case "throw-dice":
      return <FocusOn element="throw-dice" />
    default:
      return <></>
  }
}

function ProNoob() {
  const [open, setOpen] = useState(false)

  useGameStore.subscribe(
    state => state.started,
    () => {
      setOpen(true)
    },
  )

  return (
    <Modal open={open} setOpen={setOpen}>
      <h1 className="mb-4 text-center text-2xl">Are you a?</h1>

      <div className="flex size-full justify-evenly gap-4">
        <div
          onClick={() => setOpen(false)}
          className="flex h-full w-[150px] cursor-pointer flex-col gap-2 rounded-xl bg-slate-500 py-4 text-center text-xl text-black transition hover:bg-slate-600"
        >
          <h1>Pro</h1>
          <FontAwesomeIcon icon={faChessQueen} size="2x" />
        </div>
        <div
          onClick={() => useStageStore.getState().nextStage()}
          className="flex h-full w-[150px] cursor-pointer flex-col gap-2 rounded-xl bg-slate-500 py-4 text-center text-xl text-black transition hover:bg-slate-600"
        >
          <h1>New Player</h1>
          <FontAwesomeIcon icon={faChessPawn} size="2x" />
        </div>
      </div>
    </Modal>
  )
}

function FocusOn({ element }: { element: "single-player" | "throw-dice" }) {
  const layer = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const el = document.getElementById(element)
    if (el) {
      const rect = el.getBoundingClientRect()

      layer.current.style.zIndex = "22"
      layer.current.style.position = "absolute"
      layer.current.style.left = `${rect.left}px`
      layer.current.style.top = `${rect.top}px`
      layer.current.style.width = `${rect.width}px`
      layer.current.style.height = `${rect.height}px`
      // el.className += " "
      // el.onclick = () => useStageStore.getState().nextStage()
    }
  })

  return (
    <div className="absolute inset-0 z-[21] h-screen w-screen bg-[#0000005a]">
      <div ref={layer} className="bg-[#ffffff5a] p-2" onClick={() => useStageStore.getState().nextStage()}></div>
    </div>
  )
}
