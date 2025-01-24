import { NextResponse } from "next/server"

export const POST = async (request: Request) => {
  try {
    const body = request.json()
    console.log("@WEBHOOK", body)
  } catch (error) {
    console.error("Error handling webhook", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
