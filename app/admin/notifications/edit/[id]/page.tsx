"use client"
import { useRouter } from "next/navigation"
import NotificationEditor from "@/components/notification-editor"

export default function EditNotificationPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()

  return <NotificationEditor notificationId={id} />
}

