"use client"
import { useRouter } from "next/navigation"
import WidgetEditor from "@/components/widget-editor"

export default function EditWidgetPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()

  return <WidgetEditor widgetId={id} />
}

