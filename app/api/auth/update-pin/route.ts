import { type NextRequest, NextResponse } from "next/server"
import { updatePin } from "@/app/actions/auth-actions"
import { getSession } from "@/app/actions/auth-actions"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { pin } = await request.json()

    if (!pin) {
      return NextResponse.json({ error: "PIN is required" }, { status: 400 })
    }

    await updatePin(pin)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update PIN error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

