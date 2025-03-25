"use client"
import { useRouter } from "next/navigation"
import NotificationEditor from "@/components/notification-editor"

export default function NewNotificationPage() {
  const router = useRouter()

  return <NotificationEditor isNew={true} />
}

