import { type NextRequest, NextResponse } from "next/server"
import { loginWithPin } from "@/app/actions/auth-actions"

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json()

    if (!pin) {
      return NextResponse.json({ error: "PIN is required" }, { status: 400 })
    }

    const success = await loginWithPin(pin)

    if (!success) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

