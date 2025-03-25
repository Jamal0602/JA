import { type NextRequest, NextResponse } from "next/server"
import { updatePassword } from "@/app/actions/auth-actions"
import { getSession } from "@/app/actions/auth-actions"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Both current and new passwords are required" }, { status: 400 })
    }

    const success = await updatePassword(currentPassword, newPassword)

    if (!success) {
      return NextResponse.json({ error: "Invalid current password" }, { status: 401 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

