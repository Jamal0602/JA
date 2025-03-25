"use client"
import { useRouter } from "next/navigation"
import WidgetEditor from "@/components/widget-editor"

export default function NewWidgetPage() {
  const router = useRouter()

  return <WidgetEditor isNew={true} />
}

