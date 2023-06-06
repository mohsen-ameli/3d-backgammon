import axios from "axios"
import { NextResponse } from "next/server"

export type randomNames = [string, string]

export async function GET() {
  const { data } = await axios.get("https://names.drycodes.com/2?separator=space")
  return NextResponse.json(data as randomNames)
}
