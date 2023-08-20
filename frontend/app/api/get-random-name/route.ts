import axios from "axios"
import { NextResponse } from "next/server"

export type randomNames = [string, string]

export async function GET() {
  let names: randomNames
  try {
    const { data } = await axios.get("https://names.drycodes.com/2?separator=space")
    names = data as randomNames
  } catch (error) {
    names = ["Guest", "Guest"] as randomNames
  }

  return NextResponse.json(names)
}
