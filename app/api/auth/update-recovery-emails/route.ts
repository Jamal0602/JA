import { type NextRequest, NextResponse } from "next/server"
import { updateRecoveryEmails } from "@/app/actions/auth-actions"
import { getSession } from "@/app/actions/auth-actions"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { emails } = await request.json()

    if (!emails || !Array.isArray(emails)) {
      return NextResponse.json({ error: "Valid email array is required" }, { status: 400 })
    }

    await updateRecoveryEmails(emails)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update recovery emails error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

