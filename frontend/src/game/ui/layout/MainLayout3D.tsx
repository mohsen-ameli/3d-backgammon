"use client"

import PanelLayout from "./PanelLayout"
import TopLeftLayout from "./TopLeftLayout"
import TopRightLayout from "./TopRightLayout"
import WinnerLayout from "./WinnerLayout"

/**
 * The main layout of the game. Includes buttons and side panels for each user.
 */
export default function MainLayout3D() {
  return (
    <>
      <TopLeftLayout />
      <PanelLayout />
      <TopRightLayout />
      <WinnerLayout />
    </>
  )
}
